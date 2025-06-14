
import { PortalData } from '@/types/portalData';

// Simulate file-based storage using localStorage for this demo
// In a real implementation, this would interact with actual files or a file API

const STORAGE_KEY = 'professor_portal_data';

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
  openings: []
};

export class FileStorageService {
  private static instance: FileStorageService;
  
  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  // Load all data
  public loadData(): PortalData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultData;
    } catch (error) {
      console.error('Error loading data:', error);
      return defaultData;
    }
  }

  // Save all data
  public saveData(data: PortalData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  // Generic CRUD operations
  public create<T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>): T {
    const data = this.loadData();
    const newItem = { ...item, id: this.generateId() } as T;
    
    if (Array.isArray(data[section])) {
      (data[section] as T[]).push(newItem);
    }
    
    this.saveData(data);
    return newItem;
  }

  public read<T>(section: keyof PortalData): T {
    const data = this.loadData();
    return data[section] as T;
  }

  public update<T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>): T | null {
    const data = this.loadData();
    
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
    const data = this.loadData();
    
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
    const data = this.loadData();
    data.about = { ...data.about, ...updates };
    this.saveData(data);
    return data.about;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export data to JSON file
  public exportData(): string {
    const data = this.loadData();
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
