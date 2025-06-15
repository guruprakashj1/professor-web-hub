
import { supabase } from '@/integrations/supabase/client';
import { PortalData } from '@/types/portalData';

export class SupabasePortalStorageService {
  private static instance: SupabasePortalStorageService;
  private cache: PortalData | null = null;

  private constructor() {}

  static getInstance(): SupabasePortalStorageService {
    if (!this.instance) {
      this.instance = new SupabasePortalStorageService();
    }
    return this.instance;
  }

  async loadData(): Promise<PortalData> {
    try {
      // Load all portal data sections
      const { data, error } = await supabase
        .from('portal_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize default structure
      let portalData: PortalData = {
        about: {
          name: '',
          title: '',
          bio: '',
          expertise: [],
          contact: {
            email: '',
            phone: '',
            office: '',
            officeHours: ''
          },
          socialLinks: {}
        },
        education: [],
        certifications: [],
        projects: [],
        courses: [],
        research: [],
        openings: [],
        gallery: [],
        blogs: []
      };

      // Merge data from database
      data?.forEach(item => {
        if (item.content) {
          portalData[item.data_type as keyof PortalData] = item.content as any;
        }
      });

      this.cache = portalData;
      return portalData;
    } catch (error) {
      console.error('Error loading portal data:', error);
      throw error;
    }
  }

  async create<T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>): Promise<T> {
    try {
      const newItem = { ...item, id: crypto.randomUUID() } as T;
      
      // Get current data for this section
      const currentData = await this.getSectionData(section);
      const updatedData = Array.isArray(currentData) ? [...currentData, newItem] : [newItem];
      
      await this.saveSectionData(section, updatedData);
      this.clearCache();
      
      return newItem;
    } catch (error) {
      console.error(`Error creating ${section} item:`, error);
      throw error;
    }
  }

  async update<T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const currentData = await this.getSectionData(section);
      
      if (Array.isArray(currentData)) {
        const itemIndex = currentData.findIndex((item: any) => item.id === id);
        if (itemIndex === -1) return null;
        
        const updatedItem = { ...currentData[itemIndex], ...updates };
        const updatedData = [...currentData];
        updatedData[itemIndex] = updatedItem;
        
        await this.saveSectionData(section, updatedData);
        this.clearCache();
        
        return updatedItem;
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating ${section} item:`, error);
      throw error;
    }
  }

  async delete(section: keyof PortalData, id: string): Promise<boolean> {
    try {
      const currentData = await this.getSectionData(section);
      
      if (Array.isArray(currentData)) {
        const filteredData = currentData.filter((item: any) => item.id !== id);
        await this.saveSectionData(section, filteredData);
        this.clearCache();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting ${section} item:`, error);
      throw error;
    }
  }

  async updateAbout(updates: Partial<PortalData['about']>): Promise<PortalData['about']> {
    try {
      const currentAbout = await this.getSectionData('about') as PortalData['about'];
      const updatedAbout = { ...currentAbout, ...updates };
      
      await this.saveSectionData('about', updatedAbout);
      this.clearCache();
      
      return updatedAbout;
    } catch (error) {
      console.error('Error updating about section:', error);
      throw error;
    }
  }

  exportData(): string {
    if (!this.cache) {
      throw new Error('No data to export. Load data first.');
    }
    return JSON.stringify(this.cache, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonString) as PortalData;
      
      // Save each section
      for (const [section, data] of Object.entries(importedData)) {
        await this.saveSectionData(section as keyof PortalData, data);
      }
      
      this.clearCache();
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  async resetData(): Promise<void> {
    try {
      // Delete all existing portal data
      const { error } = await supabase
        .from('portal_data')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      
      this.clearCache();
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }

  private async getSectionData(section: keyof PortalData): Promise<any> {
    const { data, error } = await supabase
      .from('portal_data')
      .select('content')
      .eq('data_type', section)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data?.content || (section === 'about' ? {
      name: '',
      title: '',
      bio: '',
      expertise: [],
      contact: { email: '', phone: '', office: '', officeHours: '' },
      socialLinks: {}
    } : []);
  }

  private async saveSectionData(section: keyof PortalData, data: any): Promise<void> {
    const { error } = await supabase
      .from('portal_data')
      .upsert({
        data_type: section,
        content: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'data_type'
      });

    if (error) throw error;
  }

  clearCache(): void {
    this.cache = null;
  }
}
