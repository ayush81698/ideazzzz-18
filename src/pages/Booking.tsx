
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { 
  RadioGroup, RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';

const formSchema = z.object({
  packageType: z.enum(['standard', 'premium', 'family']),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  location: z.string({
    required_error: "Please select a studio location.",
  }),
  date: z.date({
    required_error: "Please select a date for your appointment.",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot.",
  }),
  participants: z.number().min(1).max(10),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const locations = [
  { id: 'mumbai-malad', name: 'Mumbai - Malad Studio', address: '123 Linking Road, Malad West, Mumbai 400064' },
  { id: 'mumbai-andheri', name: 'Mumbai - Andheri Studio', address: '456 Andheri East, Near Metro Station, Mumbai 400069' }
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM', '07:00 PM'
];

const packages = [
  {
    id: 'standard',
    name: 'Standard Package',
    price: 4999,
    description: 'Perfect for individuals wanting a high-quality 3D model of themselves',
    features: [
      'Full-body 3D scanning',
      'Professional editing in Blender',
      'One 6-inch 3D printed model',
      '30-minute scanning session',
      'Digital copy included'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 7999,
    description: 'Enhanced details and premium finish for the discerning customer',
    features: [
      'High-resolution full-body scanning',
      'Advanced detail work in Blender',
      'One 8-inch premium quality 3D printed model',
      '45-minute scanning session',
      'Digital copy with AR viewer',
      'Priority production'
    ],
    popular: true
  },
  {
    id: 'family',
    name: 'Family Package',
    price: 12999,
    description: 'Capture your entire family in 3D (up to 4 people)',
    features: [
      'Group scanning session',
      'Individual and group poses',
      'Professional editing in Blender',
      'Four 6-inch 3D printed models',
      '60-minute scanning session',
      'Digital copies included'
    ],
    popular: false
  }
];

const Booking = () => {
  const [selectedTab, setSelectedTab] = useState('book');
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageType: 'standard',
      fullName: '',
      email: '',
      phone: '',
      participants: 1,
      specialRequests: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Booking Submitted", {
      description: `Your booking has been confirmed for ${format(data.date, 'PPP')} at ${data.timeSlot}`,
    });
    form.reset();
  };
  
  // Simulate available time slots changing based on date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Randomly remove some time slots to simulate availability
      const dayOfWeek = date.getDay();
      let availableTimes = [...timeSlots];
      
      // Weekend has fewer slots
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        availableTimes = availableTimes.filter((_, index) => index % 2 === 0);
      }
      // Weekdays have more slots but still some are taken
      else {
        availableTimes = availableTimes.filter((_, index) => index % 3 !== 0);
      }
      
      setAvailableTimeSlots(availableTimes);
      form.setValue('date', date);
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Book Your 3D Scanning Session</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take the first step towards your personalized 3D model by booking a scanning appointment at one of our studios
          </p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          variants={fadeInUp}
        >
          <Tabs defaultValue="book" value={selectedTab} onValueChange={setSelectedTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="packages">Choose Package</TabsTrigger>
              <TabsTrigger value="book">Book Appointment</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="packages" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-ideazzz-pink shadow-lg' : 'border-gray-200'} card-hover`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="bg-ideazzz-pink text-white border-none">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-ideazzz-purple">₹{pkg.price.toLocaleString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{pkg.description}</p>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-ideazzz-pink mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${pkg.popular ? 'bg-ideazzz-pink hover:bg-ideazzz-pink/90' : 'bg-ideazzz-purple'}`}
                        onClick={() => {
                          form.setValue('packageType', pkg.id as 'standard' | 'premium' | 'family');
                          setSelectedTab('book');
                        }}
                      >
                        Select Package
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="book">
              <Card>
                <CardHeader>
                  <CardTitle>Book Your Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {packages.map((pkg) => (
                          <FormField
                            key={pkg.id}
                            control={form.control}
                            name="packageType"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div 
                                    className={`border rounded-lg p-4 cursor-pointer transition-all 
                                      ${field.value === pkg.id 
                                        ? 'border-2 border-ideazzz-purple bg-ideazzz-purple/5' 
                                        : 'border-gray-200 hover:border-ideazzz-purple/50'
                                      }`}
                                    onClick={() => form.setValue('packageType', pkg.id as 'standard' | 'premium' | 'family')}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-medium">{pkg.name}</div>
                                      <div className="flex items-center justify-center h-5 w-5 rounded-full border-2 border-ideazzz-purple">
                                        {field.value === pkg.id && (
                                          <div className="h-2.5 w-2.5 rounded-full bg-ideazzz-purple"></div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-lg font-bold text-ideazzz-purple mb-2">
                                      ₹{pkg.price.toLocaleString()}
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                                <Input placeholder="Enter your email" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="participants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Participants</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  max={10} 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Please specify how many people will be scanned
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Studio Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a studio location" />
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
                        
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Appointment Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
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
                                    onSelect={handleDateChange}
                                    disabled={(date) => 
                                      date < new Date() || // Can't book in the past
                                      date.getDay() === 1 // Closed on Mondays
                                    }
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Studios are closed on Mondays for maintenance
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeSlot"
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
                                  {availableTimeSlots.length > 0 ? (
                                    availableTimeSlots.map((timeSlot) => (
                                      <SelectItem key={timeSlot} value={timeSlot}>
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-2" />
                                          {timeSlot}
                                        </div>
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>
                                      No available slots for this date
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose from available time slots
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special requirements or notes for your session..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Let us know if you have any specific requirements for your 3D scanning session
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-ideazzz-purple hover:bg-ideazzz-dark">
                        Confirm Booking
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      question: "What should I wear for the 3D scanning session?",
                      answer: "We recommend wearing fitted, solid-colored clothing without reflective materials or complex patterns. Avoid loose or flowing garments as they can create noise in the scan data. For best results, mid-tone colors (not too light or dark) work well."
                    },
                    {
                      question: "How long does the scanning process take?",
                      answer: "The actual scanning process takes only a few minutes. However, we allocate 30-60 minutes for your appointment depending on your package to ensure we have time for preparation, multiple scans if needed, and a review of the captures."
                    },
                    {
                      question: "When will I receive my 3D printed model?",
                      answer: "Standard production time is 2-3 weeks from your scanning date. Premium packages receive priority production. You'll receive email updates throughout the process, and we'll notify you when your model is ready for pickup or has been shipped."
                    },
                    {
                      question: "Can I bring props or accessories to include in my scan?",
                      answer: "Yes, you can bring small props or accessories. However, very reflective, transparent, or intricate items might not scan well. Please inform us in advance about any props you'd like to include so we can advise on their suitability."
                    },
                    {
                      question: "What if I need to cancel or reschedule my appointment?",
                      answer: "You can reschedule or cancel your appointment up to 48 hours before your scheduled time without any fee. For changes within 48 hours, a rescheduling fee may apply. Please contact our customer service team to make any changes to your booking."
                    },
                    {
                      question: "Are there any age restrictions for scanning?",
                      answer: "We can scan people of all ages! However, children under 12 may find it challenging to remain still during the scanning process. For young children, we offer special quick-scanning sessions and may take multiple scans to ensure we capture a good pose."
                    }
                  ].map((item, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Studio Locations Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={fadeInUp}
          className="mt-16 max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Our Studio Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((location) => (
              <Card key={location.id} className="card-hover border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ideazzz-pink mr-3 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                      <p className="text-muted-foreground mb-4">{location.address}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <div className="font-medium min-w-[100px]">Opening Hours:</div>
                          <div>Tuesday - Sunday: 9 AM - 8 PM<br />Monday: Closed</div>
                        </div>
                        <div className="flex items-start">
                          <div className="font-medium min-w-[100px]">Contact:</div>
                          <div>+91 9876543210</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
