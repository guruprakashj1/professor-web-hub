
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PortalData } from '@/types/portalData';

const PORTAL_DATA_DOC = 'portal-data';

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
  education: [],
  certifications: [],
  projects: [],
  courses: [],
  research: [],
  openings: [],
  blogs: [],
  gallery: []
};

export class FirebaseStorageService {
  private static instance: FirebaseStorageService;
  private cachedData: PortalData | null = null;
  
  public static getInstance(): FirebaseStorageService {
    if (!FirebaseStorageService.instance) {
      FirebaseStorageService.instance = new FirebaseStorageService();
    }
    return FirebaseStorageService.instance;
  }

  // Load all data from Firestore
  public async loadData(): Promise<PortalData> {
    try {
      const docRef = doc(db, 'portal', PORTAL_DATA_DOC);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as PortalData;
        
        // Ensure all required arrays exist for backward compatibility
        if (!data.gallery) data.gallery = [];
        if (!data.blogs) data.blogs = [];
        if (!data.education) data.education = [];
        if (!data.certifications) data.certifications = [];
        if (!data.projects) data.projects = [];
        if (!data.courses) data.courses = [];
        if (!data.research) data.research = [];
        if (!data.openings) data.openings = [];
        
        this.cachedData = data;
        return data;
      } else {
        // Initialize with default data
        await this.saveData(defaultData);
        this.cachedData = defaultData;
        return defaultData;
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
      this.cachedData = defaultData;
      return defaultData;
    }
  }

  // Save data to Firestore
  public async saveData(data: PortalData): Promise<void> {
    try {
      const docRef = doc(db, 'portal', PORTAL_DATA_DOC);
      await setDoc(docRef, data);
      this.cachedData = data;
      console.log('Data saved to Firebase successfully');
    } catch (error) {
      console.error('Error saving data to Firebase:', error);
      throw error;
    }
  }

  // Clear cache to force reload from Firebase
  public clearCache(): void {
    this.cachedData = null;
  }

  // Generic CRUD operations
  public async create<T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>): Promise<T> {
    const data = this.cachedData || await this.loadData();
    const newItem = { ...item, id: this.generateId() } as T;
    
    if (Array.isArray(data[section])) {
      (data[section] as T[]).push(newItem);
    }
    
    await this.saveData(data);
    return newItem;
  }

  public read<T>(section: keyof PortalData): T {
    const data = this.cachedData || defaultData;
    return data[section] as T;
  }

  public async update<T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>): Promise<T | null> {
    const data = this.cachedData || await this.loadData();
    
    if (Array.isArray(data[section])) {
      const items = data[section] as T[];
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        await this.saveData(data);
        return items[index];
      }
    }
    
    return null;
  }

  public async delete(section: keyof PortalData, id: string): Promise<boolean> {
    const data = this.cachedData || await this.loadData();
    
    if (Array.isArray(data[section])) {
      const items = data[section] as { id: string }[];
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items.splice(index, 1);
        await this.saveData(data);
        return true;
      }
    }
    
    return false;
  }

  // Update about section
  public async updateAbout(updates: Partial<PortalData['about']>): Promise<PortalData['about']> {
    const data = this.cachedData || await this.loadData();
    data.about = { ...data.about, ...updates };
    await this.saveData(data);
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
  public async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      await this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON data');
    }
  }

  // Reset to default data
  public async resetData(): Promise<void> {
    await this.saveData(defaultData);
  }
}
