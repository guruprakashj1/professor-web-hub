
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const BlogCategoriesEditor = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load blog categories.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('blog_categories')
          .update({
            name: category.name,
            description: category.description,
            color: category.color,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        
        toast({
          title: "Category Updated",
          description: "Blog category has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('blog_categories')
          .insert({
            name: category.name,
            description: category.description,
            color: category.color
          });

        if (error) throw error;
        
        toast({
          title: "Category Created",
          description: "New blog category has been successfully created.",
        });
      }
      
      setEditingCategory(null);
      setIsAdding(false);
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save blog category.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { error } = await supabase
          .from('blog_categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Category Deleted",
          description: "Blog category has been successfully deleted.",
        });
        
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Error",
          description: "Failed to delete blog category.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-light text-gray-900">Loading categories...</div>
      </div>
    );
  }

  if (isAdding || editingCategory) {
    return (
      <CategoryForm
        category={editingCategory}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Categories</h2>
          <p className="text-gray-600">Manage blog post categories</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No categories created yet.</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    {category.description && (
                      <CardDescription>
                        {category.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

interface CategoryFormProps {
  category?: BlogCategory | null;
  onSave: (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CategoryForm = ({ category, onSave, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#6B7280'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {category ? 'Edit Category' : 'Create New Category'}
          </h2>
          <p className="text-gray-600">
            {category ? 'Update category details' : 'Create a new blog category'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief description of this category"
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 p-1 rounded"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#6B7280"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogCategoriesEditor;
