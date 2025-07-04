import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Tag, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSupabasePortalData } from '@/hooks/useSupabasePortalData';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/portalData';

interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

const BlogSection = () => {
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  
  const { data, loading } = useSupabasePortalData();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (data?.blogs) {
      // Only show published blogs
      const publishedBlogs = data.blogs.filter(blog => blog.status === 'Published');
      const sortedBlogs = publishedBlogs.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
      
      // Extract all unique keywords
      const keywords = new Set<string>();
      publishedBlogs.forEach(blog => {
        blog.keywords.forEach(keyword => keywords.add(keyword));
      });
      
      setAllKeywords(Array.from(keywords).sort());
      filterBlogs(sortedBlogs, searchQuery, selectedCategory, selectedKeyword);
      console.log('Loaded published blogs:', sortedBlogs);
    }
  }, [data?.blogs, searchQuery, selectedCategory, selectedKeyword]);

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

  const filterBlogs = (blogs: BlogPost[], search: string, category: string, keyword: string) => {
    let filtered = blogs;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.keywords.some(k => k.toLowerCase().includes(searchLower))
      );
    }

    if (category && category !== 'all') {
      if (category === 'uncategorized') {
        filtered = filtered.filter(blog => !blog.categoryId);
      } else {
        filtered = filtered.filter(blog => blog.categoryId === category);
      }
    }

    if (keyword) {
      filtered = filtered.filter(blog => 
        blog.keywords.includes(keyword)
      );
    }

    setFilteredBlogs(filtered);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const getBlogCountByCategory = (categoryId: string) => {
    if (!data?.blogs) return 0;
    const publishedBlogs = data.blogs.filter(blog => blog.status === 'Published');
    
    if (categoryId === 'all') {
      return publishedBlogs.length;
    }
    if (categoryId === 'uncategorized') {
      return publishedBlogs.filter(blog => !blog.categoryId).length;
    }
    return publishedBlogs.filter(blog => blog.categoryId === categoryId).length;
  };

  const handleBlogSelect = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  const getCurrentBlogIndex = () => {
    if (!selectedBlog) return -1;
    return filteredBlogs.findIndex(blog => blog.id === selectedBlog.id);
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentBlogIndex();
    if (currentIndex > 0) {
      setSelectedBlog(filteredBlogs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentBlogIndex();
    if (currentIndex < filteredBlogs.length - 1) {
      setSelectedBlog(filteredBlogs[currentIndex + 1]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isVideoUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.endsWith('.mp4');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-light text-gray-900">Loading blogs...</div>
      </div>
    );
  }

  if (selectedBlog) {
    const currentIndex = getCurrentBlogIndex();
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < filteredBlogs.length - 1;
    const category = selectedBlog.categoryId ? getCategoryById(selectedBlog.categoryId) : null;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4 text-gray-700 hover:text-black hover:bg-gray-100 font-light">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog List
          </Button>
        </div>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-light text-black mb-4">
              {selectedBlog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="font-light">{formatDate(selectedBlog.publishDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-light">{selectedBlog.readingTime} min read</span>
              </div>
              <span className="font-light">By {selectedBlog.author}</span>
              {category && (
                <Badge 
                  variant="outline" 
                  className="font-light"
                  style={{ borderColor: category.color, color: category.color }}
                >
                  {category.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedBlog.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="bg-gray-100 text-black border border-gray-200 font-light">
                  <Tag className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>

            {selectedBlog.featuredImage && (
              <img 
                src={selectedBlog.featuredImage} 
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-6 grayscale border border-gray-200"
              />
            )}
          </header>

          {selectedBlog.videoUrl && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-black" />
                <span className="font-light text-lg text-black">Featured Video</span>
              </div>
              
              {isVideoUrl(selectedBlog.videoUrl) ? (
                <div className="relative w-full border border-gray-200 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getEmbedUrl(selectedBlog.videoUrl)}
                    title={selectedBlog.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full grayscale"
                  />
                </div>
              ) : (
                <video 
                  controls 
                  className="w-full rounded-lg border border-gray-200 grayscale"
                  src={selectedBlog.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <div 
            className="blog-content text-gray-800 font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />
        </article>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <div className="flex-1">
            {hasPrevious && (
              <Button variant="outline" onClick={handlePrevious} className="w-full max-w-xs border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Post
              </Button>
            )}
          </div>
          
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600 font-light">
              {currentIndex + 1} of {filteredBlogs.length}
            </span>
          </div>
          
          <div className="flex-1 text-right">
            {hasNext && (
              <Button variant="outline" onClick={handleNext} className="w-full max-w-xs border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
                Next Post
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-black mb-4">Blog</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto font-light">
          Insights, research updates, and thoughts on education and technology.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-black font-light"
          />
        </div>
      </div>

      {/* Categories - Horizontal Display */}
      <div className="mb-8">
        <h3 className="text-lg font-light text-black mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? "default" : "outline"}
            className={`cursor-pointer font-light ${
              selectedCategory === 'all' 
                ? "bg-black text-white hover:bg-gray-800 border-black" 
                : "border-gray-300 text-gray-700 hover:text-black hover:border-black"
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Posts ({getBlogCountByCategory('all')})
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer font-light ${
                selectedCategory === category.id 
                  ? "bg-black text-white hover:bg-gray-800 border-black" 
                  : "border-gray-300 text-gray-700 hover:text-black hover:border-black"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
            >
              {category.name} ({getBlogCountByCategory(category.id)})
            </Badge>
          ))}
          {getBlogCountByCategory('uncategorized') > 0 && (
            <Badge
              variant={selectedCategory === 'uncategorized' ? "default" : "outline"}
              className={`cursor-pointer font-light ${
                selectedCategory === 'uncategorized' 
                  ? "bg-black text-white hover:bg-gray-800 border-black" 
                  : "border-gray-300 text-gray-700 hover:text-black hover:border-black"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === 'uncategorized' ? 'all' : 'uncategorized')}
            >
              Uncategorized ({getBlogCountByCategory('uncategorized')})
            </Badge>
          )}
        </div>
      </div>

      {/* Keyword Filter */}
      {allKeywords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-light text-black mb-3">Topics</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedKeyword === '' ? "default" : "outline"}
              className={`cursor-pointer font-light ${
                selectedKeyword === '' 
                  ? "bg-black text-white hover:bg-gray-800 border-black" 
                  : "border-gray-300 text-gray-700 hover:text-black hover:border-black"
              }`}
              onClick={() => setSelectedKeyword('')}
            >
              All Topics
            </Badge>
            {allKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant={selectedKeyword === keyword ? "default" : "outline"}
                className={`cursor-pointer font-light ${
                  selectedKeyword === keyword 
                    ? "bg-black text-white hover:bg-gray-800 border-black" 
                    : "border-gray-300 text-gray-700 hover:text-black hover:border-black"
                }`}
                onClick={() => setSelectedKeyword(selectedKeyword === keyword ? '' : keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg font-light">
              {searchQuery || selectedKeyword ? 'No blog posts found matching your criteria.' : 'No blog posts available.'}
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => {
            const category = blog.categoryId ? getCategoryById(blog.categoryId) : null;
            return (
              <Card 
                key={blog.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black bg-white hover:scale-105"
                onClick={() => handleBlogSelect(blog)}
              >
                {blog.featuredImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 grayscale"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-light">{formatDate(blog.publishDate)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span className="font-light">{blog.readingTime} min read</span>
                    {category && (
                      <Badge 
                        variant="outline" 
                        className="text-xs font-light ml-auto"
                        style={{ borderColor: category.color, color: category.color }}
                      >
                        {category.name}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="line-clamp-2 hover:text-black transition-colors font-light text-gray-900">
                    {blog.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3 font-light text-gray-700">
                    {blog.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs bg-gray-100 text-black border border-gray-200 font-light">
                        {keyword}
                      </Badge>
                    ))}
                    {blog.keywords.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-black border border-gray-200 font-light">
                        +{blog.keywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {blog.videoUrl && (
                    <div className="flex items-center gap-1 text-sm text-black">
                      <Play className="w-4 h-4" />
                      <span className="font-light">Video Content</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogSection;
