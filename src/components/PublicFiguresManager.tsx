
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Trash2, Edit, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
  subtitle?: string;
  description?: string;
  order?: number;
}

const PublicFiguresManager = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFigure, setCurrentFigure] = useState<PublicFigure | null>(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      setLoading(true);
      
      // Check if the table exists before querying
      try {
        const { data, error } = await supabase
          .from('public_figures')
          .select('*')
          .order('order', { ascending: true });
        
        if (!error) {
          // Table exists, map the data to our interface
          const mappedData = (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            imageurl: item.imageurl,
            subtitle: item.subtitle || '',
            description: item.description || '',
            order: item.order || 0
          }));
          setFigures(mappedData);
        } else {
          console.error('Error checking public_figures table:', error);
          setFigures([]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        setFigures([]);
      }
      
    } catch (error) {
      console.error('Error fetching public figures:', error);
      toast.error('Failed to load public figures data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (figure: PublicFigure | null = null) => {
    if (figure) {
      setCurrentFigure(figure);
      setName(figure.name);
      setImageUrl(figure.imageurl);
      setSubtitle(figure.subtitle || '');
      setDescription(figure.description || '');
      setIsEditing(true);
    } else {
      setCurrentFigure(null);
      setName('');
      setImageUrl('');
      setSubtitle('');
      setDescription('');
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentFigure(null);
    setName('');
    setImageUrl('');
    setSubtitle('');
    setDescription('');
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      if (!name || !imageUrl) {
        toast.error('Name and image URL are required');
        return;
      }

      if (isEditing && currentFigure) {
        // Update existing figure
        const { error } = await supabase
          .from('public_figures')
          .update({
            name,
            imageurl: imageUrl,
            subtitle,
            description
          })
          .eq('id', currentFigure.id);

        if (error) {
          console.error('Error updating figure:', error);
          throw error;
        }
        toast.success('Public figure updated successfully');
      } else {
        // Get the highest order to add the new item at the end
        const maxOrder = figures.length > 0 
          ? Math.max(...figures.map(fig => fig.order || 0)) + 1
          : 0;

        // Insert new figure
        const { error } = await supabase
          .from('public_figures')
          .insert({
            name,
            imageurl: imageUrl,
            subtitle,
            description,
            order: maxOrder
          });

        if (error) {
          console.error('Error inserting figure:', error);
          throw error;
        }
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

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const index = figures.findIndex(figure => figure.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === figures.length - 1)) {
      return; // Can't move further
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFigures = [...figures];
    const temp = newFigures[index];
    newFigures[index] = newFigures[newIndex];
    newFigures[newIndex] = temp;

    // Update order values
    const updatedFigures = newFigures.map((figure, i) => ({
      ...figure,
      order: i
    }));

    setFigures(updatedFigures);

    // Update in database
    try {
      const updates = [
        { id: updatedFigures[index].id, order: updatedFigures[index].order },
        { id: updatedFigures[newIndex].id, order: updatedFigures[newIndex].order }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('public_figures')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to reorder figures');
      fetchFigures(); // Reload the original order
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
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Image Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {figures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No public figures added yet. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                figures.map((figure, index) => (
                  <TableRow key={figure.id}>
                    <TableCell className="w-24">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled={index === 0}
                          onClick={() => moveItem(figure.id, 'up')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled={index === figures.length - 1}
                          onClick={() => moveItem(figure.id, 'down')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{figure.name}</TableCell>
                    <TableCell>{figure.subtitle || "—"}</TableCell>
                    <TableCell>
                      <div className="h-16 w-16 overflow-hidden rounded-md">
                        <img 
                          src={figure.imageurl} 
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
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subtitle" className="text-sm font-medium">Subtitle</label>
              <Input 
                id="subtitle"
                value={subtitle} 
                onChange={e => setSubtitle(e.target.value)} 
                placeholder="Enter subtitle (optional)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Enter description (optional)"
                rows={3}
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
