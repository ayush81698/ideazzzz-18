
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';

interface PublicFigure {
  id: string;
  name: string;
  imageUrl: string;
}

const PublicFiguresManager = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFigure, setCurrentFigure] = useState<PublicFigure | null>(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      setLoading(true);
      // Ensure the table exists
      const { error: tableCheckError } = await supabase
        .from('public_figures')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        // If table doesn't exist, create it
        await createFiguresTable();
      }

      // Now fetch the data
      const { data, error } = await supabase
        .from('public_figures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFigures(data || []);
    } catch (error) {
      console.error('Error fetching public figures:', error);
      toast.error('Failed to load public figures data');
    } finally {
      setLoading(false);
    }
  };

  const createFiguresTable = async () => {
    try {
      // Create the table using SQL
      const { error } = await supabase.rpc('create_public_figures_table');
      
      if (error) {
        console.error('Error creating table:', error);
        // Fallback method if RPC isn't set up
        await supabase.auth.getUser(); // Ensure we're authenticated
      }
    } catch (error) {
      console.error('Error setting up public figures:', error);
    }
  };

  const handleOpenDialog = (figure: PublicFigure | null = null) => {
    if (figure) {
      setCurrentFigure(figure);
      setName(figure.name);
      setImageUrl(figure.imageUrl);
      setIsEditing(true);
    } else {
      setCurrentFigure(null);
      setName('');
      setImageUrl('');
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentFigure(null);
    setName('');
    setImageUrl('');
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      if (!name || !imageUrl) {
        toast.error('Please fill in all fields');
        return;
      }

      if (isEditing && currentFigure) {
        // Update existing figure
        const { error } = await supabase
          .from('public_figures')
          .update({
            name,
            imageUrl
          })
          .eq('id', currentFigure.id);

        if (error) throw error;
        toast.success('Public figure updated successfully');
      } else {
        // Insert new figure
        const { error } = await supabase
          .from('public_figures')
          .insert([
            {
              name,
              imageUrl
            }
          ]);

        if (error) throw error;
        toast.success('Public figure added successfully');
      }

      // Refresh the list
      handleCloseDialog();
      fetchFigures();
    } catch (error) {
      console.error('Error saving public figure:', error);
      toast.error('Failed to save public figure');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('public_figures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFigures(figures.filter(figure => figure.id !== id));
      toast.success('Public figure deleted successfully');
    } catch (error) {
      console.error('Error deleting public figure:', error);
      toast.error('Failed to delete public figure');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Public Figures Management</h2>
        <Button onClick={() => handleOpenDialog()} className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">
          <Plus className="h-4 w-4 mr-2" /> Add New Figure
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {figures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No public figures added yet. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                figures.map(figure => (
                  <TableRow key={figure.id}>
                    <TableCell className="font-medium">{figure.name}</TableCell>
                    <TableCell>
                      <div className="h-16 w-16 overflow-hidden rounded-md">
                        <img 
                          src={figure.imageUrl} 
                          alt={figure.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleOpenDialog(figure)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDelete(figure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Public Figure' : 'Add New Public Figure'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name"
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter celebrity name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
              <Input 
                id="imageUrl"
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="h-40 w-full overflow-hidden rounded-md">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">
              {isEditing ? 'Update' : 'Add'} Public Figure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicFiguresManager;
