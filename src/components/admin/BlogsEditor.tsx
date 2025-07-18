import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogPost } from '@/types/portalData';
import { useSupabasePortalData } from '@/hooks/useSupabasePortalData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

const BlogsEditor = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { data, loading, createItem, updateItem, deleteItem, refreshData } = useSupabasePortalData();
  const { toast } = useToast();

  useEffect(() => {
    if (data?.blogs) {
      const sortedBlogs = [...data.blogs].sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
      setBlogs(sortedBlogs);
      console.log('Loaded blogs from Supabase:', sortedBlogs);
    }
  }, [data?.blogs]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const generateId = (): string => {
    return crypto.randomUUID();
  };

  const handleSave = async (blog: Omit<BlogPost, 'id' | 'lastModified'>) => {
    try {
      const readingTime = calculateReadingTime(blog.content);
      
      // Convert "none" back to undefined for categoryId
      const blogToSave = {
        ...blog,
        categoryId: blog.categoryId === 'none' ? undefined : blog.categoryId
      };
      
      if (editingBlog) {
        const updatedBlog: BlogPost = {
          ...editingBlog,
          ...blogToSave,
          readingTime,
          lastModified: new Date().toISOString()
        };
        await updateItem<BlogPost>('blogs', editingBlog.id, updatedBlog);
        toast({
          title: "Blog Updated",
          description: "Blog post has been successfully updated.",
        });
      } else {
        const newBlog: BlogPost = {
          ...blogToSave,
          id: generateId(),
          readingTime,
          lastModified: new Date().toISOString()
        };
        await createItem<BlogPost>('blogs', newBlog);
        toast({
          title: "Blog Created",
          description: "New blog post has been successfully created.",
        });
      }
      
      setEditingBlog(null);
      setIsAdding(false);
      await refreshData();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteItem('blogs', id);
        toast({
          title: "Blog Deleted",
          description: "Blog post has been successfully deleted.",
        });
        await refreshData();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast({
          title: "Error",
          description: "Failed to delete blog post.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setIsAdding(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-light text-gray-900">Loading blogs...</div>
      </div>
    );
  }

  if (isAdding || editingBlog) {
    return (
      <BlogForm
        blog={editingBlog}
        categories={categories}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No blog posts created yet.</p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog) => {
            const category = blog.categoryId ? getCategoryById(blog.categoryId) : null;
            return (
              <Card key={blog.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                        <Badge variant={blog.status === 'Published' ? 'default' : 'secondary'}>
                          {blog.status === 'Published' ? (
                            <><Eye className="w-3 h-3 mr-1" />Published</>
                          ) : (
                            <><EyeOff className="w-3 h-3 mr-1" />Draft</>
                          )}
                        </Badge>
                        {category && (
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: category.color, color: category.color }}
                          >
                            {category.name}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {blog.excerpt}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Published: {formatDate(blog.publishDate)}</span>
                        <span>Reading time: {blog.readingTime} min</span>
                        <span>Keywords: {blog.keywords.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {blog.keywords.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {blog.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

interface BlogFormProps {
  blog?: BlogPost | null;
  categories: BlogCategory[];
  onSave: (blog: Omit<BlogPost, 'id' | 'lastModified'>) => void;
  onCancel: () => void;
}

const BlogForm = ({ blog, categories, onSave, onCancel }: BlogFormProps) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    keywords: blog?.keywords.join(', ') || '',
    author: blog?.author || 'Dr. Jane Smith',
    publishDate: blog?.publishDate || new Date().toISOString().split('T')[0],
    status: blog?.status || 'Draft' as const,
    seoTitle: blog?.seoTitle || '',
    seoDescription: blog?.seoDescription || '',
    featuredImage: blog?.featuredImage || '',
    videoUrl: blog?.videoUrl || '',
    categoryId: blog?.categoryId || 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywords = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    onSave({
      ...formData,
      keywords,
      publishDate: formData.publishDate + 'T00:00:00.000Z',
      readingTime: 0 // Will be calculated in handleSave
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <p className="text-gray-600">
            {blog ? 'Update your blog post' : 'Write and publish a new blog post'}
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
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="Brief description of the blog post"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Write your blog post content here... You can use HTML tags for formatting."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Draft' | 'Published') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="machine learning, AI, research (comma separated)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="YouTube, Vimeo, or direct video URL"
              />
            </div>

            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Optimized title for search engines"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={2}
                placeholder="Meta description for search engines"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {blog ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogsEditor;
