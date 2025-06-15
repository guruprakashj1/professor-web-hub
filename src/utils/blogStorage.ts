
import { BlogPost } from '@/types/portalData';

// Blog-specific storage utility
const BLOG_FOLDER_KEY = 'professor_portal_blogs';

export class BlogStorageService {
  private static instance: BlogStorageService;
  
  public static getInstance(): BlogStorageService {
    if (!BlogStorageService.instance) {
      BlogStorageService.instance = new BlogStorageService();
    }
    return BlogStorageService.instance;
  }

  // Load all blog posts
  public loadAllBlogs(): BlogPost[] {
    try {
      const stored = localStorage.getItem(BLOG_FOLDER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error loading blogs:', error);
      return [];
    }
  }

  // Save all blog posts
  public saveAllBlogs(blogs: BlogPost[]): void {
    try {
      localStorage.setItem(BLOG_FOLDER_KEY, JSON.stringify(blogs, null, 2));
    } catch (error) {
      console.error('Error saving blogs:', error);
      throw new Error('Failed to save blogs');
    }
  }

  // Load single blog post
  public loadBlog(id: string): BlogPost | null {
    const blogs = this.loadAllBlogs();
    return blogs.find(blog => blog.id === id) || null;
  }

  // Save single blog post
  public saveBlog(blog: BlogPost): BlogPost {
    const blogs = this.loadAllBlogs();
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
  public deleteBlog(id: string): boolean {
    const blogs = this.loadAllBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    
    if (filteredBlogs.length !== blogs.length) {
      this.saveAllBlogs(filteredBlogs);
      return true;
    }
    
    return false;
  }

  // Search blogs
  public searchBlogs(query: string): BlogPost[] {
    const blogs = this.loadAllBlogs();
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
  public getPublishedBlogs(): BlogPost[] {
    return this.loadAllBlogs()
      .filter(blog => blog.status === 'Published')
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
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
  public getAllKeywords(): string[] {
    const blogs = this.getPublishedBlogs();
    const keywordSet = new Set<string>();
    
    blogs.forEach(blog => {
      blog.keywords.forEach(keyword => keywordSet.add(keyword));
    });
    
    return Array.from(keywordSet);
  }
}
