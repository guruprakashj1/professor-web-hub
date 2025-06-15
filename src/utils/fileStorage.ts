
import { PortalData } from '@/types/portalData';

// File-based storage using JSON files in the public folder
const DATA_FILE_URL = '/data/portal-data.json';

// Default data structure
const defaultData: PortalData = {
  about: {
    name: 'Dr. Jane Smith',
    title: 'Professor of Computer Science',
    bio: 'Experienced educator and researcher with expertise in machine learning, artificial intelligence, and educational technology.',
    expertise: ['Machine Learning', 'Artificial Intelligence', 'Educational Technology', 'Data Science'],
    contact: {
      email: 'jane.smith@university.edu',
      phone: '+1 (555) 123-4567',
      office: 'Room 405, CS Building',
      officeHours: 'Tuesdays and Thursdays, 2:00 PM - 4:00 PM'
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/drjanesmith',
      researchGate: 'https://researchgate.net/profile/Jane_Smith',
      googleScholar: 'https://scholar.google.com/citations?user=abc123',
      orcid: 'https://orcid.org/0000-0000-0000-0000'
    }
  },
  education: [
    {
      id: '1',
      degree: 'Ph.D. in Computer Science',
      institution: 'Stanford University',
      year: '2008',
      location: 'Stanford, CA',
      description: 'Dissertation: "Advanced Machine Learning Algorithms for Educational Applications"',
      advisor: 'Dr. Jane Smith',
      achievements: ['Summa Cum Laude', 'Outstanding Dissertation Award', 'Teaching Excellence Award']
    }
  ],
  certifications: [
    {
      id: '1',
      title: 'Certified Data Scientist',
      organization: 'Data Science Council of America',
      year: '2020'
    }
  ],
  projects: [],
  courses: [],
  research: [],
  openings: [],
  blogs: [],
  gallery: []
};

export class FileStorageService {
  private static instance: FileStorageService;
  private cachedData: PortalData | null = null;
  
  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  // Load all data from JSON file
  public async loadData(): Promise<PortalData> {
    try {
      // Return cached data if available
      if (this.cachedData) {
        return this.cachedData;
      }

      const response = await fetch(DATA_FILE_URL);
      if (!response.ok) {
        console.warn('Could not load data file, using default data');
        this.cachedData = defaultData;
        return defaultData;
      }
      
      const data = await response.json();
      
      // Ensure gallery array exists for backward compatibility
      if (!data.gallery) {
        data.gallery = [];
      }
      
      // Update existing gallery items to new format for backward compatibility
      data.gallery = data.gallery.map((item: any) => {
        if (!item.mediaType) {
          return {
            ...item,
            mediaType: 'photo',
            uploadType: 'url',
            photo: item.photo || '',
            video: ''
          };
        }
        return item;
      });
      
      // Ensure blogs array exists for backward compatibility
      if (!data.blogs) {
        data.blogs = [];
      }

      this.cachedData = data;
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      this.cachedData = defaultData;
      return defaultData;
    }
  }

  // Save data - in production this would need a backend API
  public saveData(data: PortalData): void {
    this.cachedData = data;
    console.log('Data updated in memory. In production, this would save to the JSON file via an API.');
    console.log('Current data state:', JSON.stringify(data, null, 2));
    
    // Create downloadable JSON for manual update
    this.createDownloadableJSON(data);
  }

  // Create a downloadable JSON file for manual updates
  private createDownloadableJSON(data: PortalData): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portal-data.json';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('Download triggered for updated portal-data.json. Replace the file in public/data/ and refresh the page.');
  }

  // Clear cache to force reload from file
  public clearCache(): void {
    this.cachedData = null;
  }

  // Generic CRUD operations
  public create<T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>): T {
    const data = this.cachedData || defaultData;
    const newItem = { ...item, id: this.generateId() } as T;
    
    if (Array.isArray(data[section])) {
      (data[section] as T[]).push(newItem);
    }
    
    this.saveData(data);
    return newItem;
  }

  public read<T>(section: keyof PortalData): T {
    const data = this.cachedData || defaultData;
    return data[section] as T;
  }

  public update<T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>): T | null {
    const data = this.cachedData || defaultData;
    
    if (Array.isArray(data[section])) {
      const items = data[section] as T[];
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        this.saveData(data);
        return items[index];
      }
    }
    
    return null;
  }

  public delete(section: keyof PortalData, id: string): boolean {
    const data = this.cachedData || defaultData;
    
    if (Array.isArray(data[section])) {
      const items = data[section] as { id: string }[];
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items.splice(index, 1);
        this.saveData(data);
        return true;
      }
    }
    
    return false;
  }

  // Update about section
  public updateAbout(updates: Partial<PortalData['about']>): PortalData['about'] {
    const data = this.cachedData || defaultData;
    data.about = { ...data.about, ...updates };
    this.saveData(data);
    return data.about;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export data to JSON file
  public exportData(): string {
    const data = this.cachedData || defaultData;
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  public importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON data');
    }
  }

  // Reset to default data
  public resetData(): void {
    this.saveData(defaultData);
  }
}
