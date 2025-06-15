
import { BlogPost } from '@/types/portalData';

// Blog-specific storage utility using JSON files
const BLOG_FILE_URL = '/data/portal-data.json';

export class BlogStorageService {
  private static instance: BlogStorageService;
  private cachedBlogs: BlogPost[] | null = null;
  
  public static getInstance(): BlogStorageService {
    if (!BlogStorageService.instance) {
      BlogStorageService.instance = new BlogStorageService();
    }
    return BlogStorageService.instance;
  }

  // Load all blog posts from the main data file
  public async loadAllBlogs(): Promise<BlogPost[]> {
    try {
      if (this.cachedBlogs) {
        return this.cachedBlogs;
      }

      const response = await fetch(BLOG_FILE_URL);
      if (!response.ok) {
        console.warn('Could not load data file');
        this.cachedBlogs = [];
        return [];
      }
      
      const data = await response.json();
      this.cachedBlogs = data.blogs || [];
      return this.cachedBlogs;
    } catch (error) {
      console.error('Error loading blogs:', error);
      this.cachedBlogs = [];
      return [];
    }
  }

  // Save all blog posts - creates downloadable file in development
  public saveAllBlogs(blogs: BlogPost[]): void {
    this.cachedBlogs = blogs;
    console.log('Blogs updated in memory. Download the updated JSON file to replace public/data/portal-data.json');
    
    // In a real deployment, this would save to the file via an API
    this.createDownloadableJSON(blogs);
  }

  // Create downloadable JSON for manual update
  private async createDownloadableJSON(blogs: BlogPost[]): Promise<void> {
    try {
      // Load current data and update blogs section
      const response = await fetch(BLOG_FILE_URL);
      let fullData = {
        about: {},
        education: [],
        certifications: [],
        projects: [],
        courses: [],
        research: [],
        openings: [],
        blogs: [],
        gallery: []
      };
      
      if (response.ok) {
        fullData = await response.json();
      }
      
      fullData.blogs = blogs;
      
      const dataStr = JSON.stringify(fullData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'portal-data.json';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating downloadable JSON:', error);
    }
  }

  // Load single blog post
  public async loadBlog(id: string): Promise<BlogPost | null> {
    const blogs = await this.loadAllBlogs();
    return blogs.find(blog => blog.id === id) || null;
  }

  // Save single blog post
  public async saveBlog(blog: BlogPost): Promise<BlogPost> {
    const blogs = await this.loadAllBlogs();
    const existingIndex = blogs.findIndex(b => b.id === blog.id);
    
    if (existingIndex >= 0) {
      blogs[existingIndex] = { ...blog, lastModified: new Date().toISOString() };
    } else {
      blogs.push(blog);
    }
    
    this.saveAllBlogs(blogs);
    return blog;
  }

  // Delete blog post
  public async deleteBlog(id: string): Promise<boolean> {
    const blogs = await this.loadAllBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    
    if (filteredBlogs.length !== blogs.length) {
      this.saveAllBlogs(filteredBlogs);
      return true;
    }
    
    return false;
  }

  // Search blogs
  public async searchBlogs(query: string): Promise<BlogPost[]> {
    const blogs = await this.loadAllBlogs();
    const lowercaseQuery = query.toLowerCase();
    
    return blogs.filter(blog => 
      blog.status === 'Published' && (
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.content.toLowerCase().includes(lowercaseQuery) ||
        blog.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
        blog.excerpt.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Get published blogs
  public async getPublishedBlogs(): Promise<BlogPost[]> {
    const blogs = await this.loadAllBlogs();
    return blogs
      .filter(blog => blog.status === 'Published')
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  // Clear cache
  public clearCache(): void {
    this.cachedBlogs = null;
  }

  // Calculate reading time
  public calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Generate ID
  public generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get all keywords
  public async getAllKeywords(): Promise<string[]> {
    const blogs = await this.getPublishedBlogs();
    const keywordSet = new Set<string>();
    
    blogs.forEach(blog => {
      blog.keywords.forEach(keyword => keywordSet.add(keyword));
    });
    
    return Array.from(keywordSet);
  }
}
