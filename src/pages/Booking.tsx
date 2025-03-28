
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const packages = [
  {
    id: "standard",
    name: "Standard Package",
    price: "₹2,499",
    description: "Basic 3D scanning service with standard resolution.",
    features: [
      "30-minute session",
      "Basic file formats (STL, OBJ)",
      "Standard resolution scan",
      "Digital delivery within 3 days"
    ]
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "₹4,999",
    description: "Enhanced 3D scanning with higher resolution and texture capture.",
    features: [
      "45-minute session",
      "Advanced file formats (STL, OBJ, GLTF)",
      "High resolution scan with textures",
      "Digital delivery within 2 days",
      "Basic post-processing included"
    ]
  },
  {
    id: "family",
    name: "Family Package",
    price: "₹9,999",
    description: "Comprehensive 3D scanning for multiple subjects or complex objects.",
    features: [
      "90-minute session",
      "Multiple subjects (up to 4 people/objects)",
      "Premium resolution with detailed textures",
      "All file formats supported",
      "Digital delivery within 3 days",
      "Advanced post-processing",
      "One free physical print (up to 6 inches)"
    ]
  }
];

const locations = [
  { id: "mumbai-andheri", name: "Mumbai - Andheri Studio" },
  { id: "mumbai-malad", name: "Mumbai - Malad Studio" },
  { id: "delhi-central", name: "Delhi - Central Studio" },
  { id: "bangalore-koramangala", name: "Bangalore - Koramangala Studio" }
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  package: z.string({
    required_error: "Please select a package.",
  }),
  location: z.string({
    required_error: "Please select a studio location.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time slot.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Booking = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Check for user session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Session data:", data);
      setUser(data.session?.user || null);
      
      // If user is logged in, pre-fill the form
      if (data.session?.user) {
        form.setValue('email', data.session.user.email);
        if (data.session.user.user_metadata?.name) {
          form.setValue('name', data.session.user.user_metadata.name);
        }
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user || null);
      
      if (session?.user) {
        form.setValue('email', session.user.email);
        if (session.user.user_metadata?.name) {
          form.setValue('name', session.user.user_metadata.name);
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      package: "standard",
      location: "mumbai-andheri",
      time: "10:00 AM"
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    
    try {
      console.log("Submitting booking with data:", data);
      
      // If user is not logged in, redirect to auth page
      if (!user) {
        toast.info("Please log in to book a session", {
          description: "Creating an account lets you manage your bookings",
          action: {
            label: "Log In",
            onClick: () => navigate("/auth")
          }
        });
        return;
      }
      
      // Format the date as a string
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      // Get the package name from the selected package ID
      const packageName = packages.find(p => p.id === data.package)?.name;
      
      // Get the location name from the selected location ID
      const locationName = locations.find(l => l.id === data.location)?.name;
      
      // Create booking in Supabase
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: data.name,
            email: data.email,
            phone: data.phone,
            package: packageName,
            location: locationName,
            date: formattedDate,
            time: data.time,
            status: 'pending',
            can_cancel: true,
            user_id: user.id
          }
        ])
        .select();
      
      if (error) {
        console.error("Error creating booking:", error);
        throw error;
      }
      
      console.log("Booking created successfully:", bookingData);
      
      toast.success("Booking Confirmed!", {
        description: `Your ${packageName} session has been booked for ${formattedDate} at ${data.time}`,
      });
      
      // Navigate to profile page to view booking
      navigate('/profile');
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Booking Failed", {
        description: "There was an error processing your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    form.setValue("package", packageId);
  };
  
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your 3D Scanning Session</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schedule a professional 3D scanning session at one of our studios. Our expert technicians 
            will help capture every detail of your subject with precision.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: packages.findIndex(p => p.id === pkg.id) * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card 
                className={`h-full ${selectedPackage === pkg.id ? 'border-2 border-ideazzz-purple shadow-lg' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {selectedPackage === pkg.id && (
                  <div className="absolute top-4 right-4 bg-ideazzz-purple text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="text-2xl font-bold text-ideazzz-purple mt-2">{pkg.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${selectedPackage === pkg.id ? 'bg-ideazzz-purple' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Fill in your information to complete your booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="package"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a package" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {packages.map((pkg) => (
                                  <SelectItem key={pkg.id} value={pkg.id}>
                                    {pkg.name} ({pkg.price})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Studio Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => 
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                                    date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Allow booking up to 3 months ahead
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((timeSlot) => (
                                  <SelectItem key={timeSlot} value={timeSlot}>
                                    {timeSlot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-ideazzz-purple"
                        disabled={submitting}
                      >
                        {submitting ? "Processing..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  What to expect during your 3D scanning session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-ideazzz-purple text-white rounded-full -left-4">
                      1
                    </span>
                    <h3 className="font-semibold text-lg">Preparation</h3>
                    <p className="text-muted-foreground">
                      Arrive 15 minutes before your appointment. Our team will explain the scanning process and help you prepare.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-ideazzz-purple text-white rounded-full -left-4">
                      2
                    </span>
                    <h3 className="font-semibold text-lg">Scanning Session</h3>
                    <p className="text-muted-foreground">
                      Using our state-of-the-art equipment, we'll capture detailed 3D data of your subject from multiple angles.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-ideazzz-purple text-white rounded-full -left-4">
                      3
                    </span>
                    <h3 className="font-semibold text-lg">Processing</h3>
                    <p className="text-muted-foreground">
                      Our technical team will process the scan data, clean up any artifacts, and create your 3D model.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-ideazzz-purple text-white rounded-full -left-4">
                      4
                    </span>
                    <h3 className="font-semibold text-lg">Delivery</h3>
                    <p className="text-muted-foreground">
                      You'll receive your completed 3D model files via email within the timeframe specified in your package.
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">What should I wear for a 3D body scan?</h3>
                  <p className="text-muted-foreground">
                    Wear form-fitting clothing in solid colors (avoid patterns, shiny materials, or very loose clothing). For best results, avoid accessories like watches or large jewelry.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How long does the scanning process take?</h3>
                  <p className="text-muted-foreground">
                    The actual scanning takes 5-15 minutes depending on the complexity. Your total session time is as specified in your chosen package.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Can I cancel or reschedule my appointment?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel or reschedule up to 24 hours before your appointment through your profile page at no additional cost.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">What file formats will I receive?</h3>
                  <p className="text-muted-foreground">
                    Depending on your package, you'll receive STL, OBJ, and/or GLTF formats. Additional formats are available upon request.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
