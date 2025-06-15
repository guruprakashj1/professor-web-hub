
import { supabase } from '@/integrations/supabase/client';
import { ApplicationData } from '@/types/application';

interface ApplicationFormData {
  openingId: string;
  openingTitle: string;
  name: string;
  phone: string;
  email: string;
  qualifications: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}

export class SupabaseApplicationStorageService {
  private static instance: SupabaseApplicationStorageService;

  private constructor() {}

  static getInstance(): SupabaseApplicationStorageService {
    if (!this.instance) {
      this.instance = new SupabaseApplicationStorageService();
    }
    return this.instance;
  }

  async saveApplication(formData: ApplicationFormData, resumeFile?: File): Promise<ApplicationData> {
    try {
      let resumeUrl = formData.resumeUrl;
      let resumeFileName = '';
      let resumePath = '';

      // Handle file upload to storage if file is provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        resumePath = `applications/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portal-files')
          .upload(resumePath, resumeFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portal-files')
          .getPublicUrl(resumePath);

        resumeUrl = publicUrl;
        resumeFileName = resumeFile.name;
      }

      const { data, error } = await supabase
        .from('applications')
        .insert({
          opening_id: formData.openingId,
          opening_title: formData.openingTitle,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          qualifications: formData.qualifications,
          portfolio_url: formData.portfolioUrl || null,
          resume_url: resumeUrl || null,
          resume_file_name: resumeFileName || null,
          resume_path: resumePath || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        openingId: data.opening_id,
        openingTitle: data.opening_title,
        name: data.name,
        phone: data.phone,
        email: data.email,
        qualifications: data.qualifications,
        portfolioUrl: data.portfolio_url || '',
        resumeFileName: data.resume_file_name || '',
        resumeUrl: data.resume_url || '',
        applicationDate: data.application_date || new Date().toISOString(),
        status: data.status as ApplicationData['status']
      };
    } catch (error) {
      console.error('Error saving application:', error);
      throw error;
    }
  }

  async getApplicationsByOpening(openingId: string): Promise<ApplicationData[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('opening_id', openingId)
        .order('application_date', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        openingId: item.opening_id,
        openingTitle: item.opening_title,
        name: item.name,
        phone: item.phone,
        email: item.email,
        qualifications: item.qualifications,
        portfolioUrl: item.portfolio_url || '',
        resumeFileName: item.resume_file_name || '',
        resumeUrl: item.resume_url || '',
        applicationDate: item.application_date || new Date().toISOString(),
        status: item.status as ApplicationData['status']
      }));
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId: string, status: ApplicationData['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  async getAllApplications(): Promise<ApplicationData[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('application_date', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        openingId: item.opening_id,
        openingTitle: item.opening_title,
        name: item.name,
        phone: item.phone,
        email: item.email,
        qualifications: item.qualifications,
        portfolioUrl: item.portfolio_url || '',
        resumeFileName: item.resume_file_name || '',
        resumeUrl: item.resume_url || '',
        applicationDate: item.application_date || new Date().toISOString(),
        status: item.status as ApplicationData['status']
      }));
    } catch (error) {
      console.error('Error loading all applications:', error);
      throw error;
    }
  }
}
