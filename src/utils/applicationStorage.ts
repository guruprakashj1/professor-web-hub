
import { ApplicationData } from '@/types/application';

const APPLICATIONS_FILE_URL = '/data/applications.json';

export class ApplicationStorageService {
  private static instance: ApplicationStorageService;
  private cachedApplications: ApplicationData[] | null = null;
  
  public static getInstance(): ApplicationStorageService {
    if (!ApplicationStorageService.instance) {
      ApplicationStorageService.instance = new ApplicationStorageService();
    }
    return ApplicationStorageService.instance;
  }

  public async saveApplication(
    applicationData: Omit<ApplicationData, 'id' | 'applicationDate' | 'status' | 'resumePath' | 'resumeFileName'>,
    resumeFile?: File
  ): Promise<ApplicationData> {
    try {
      const applications = await this.loadApplications();
      let resumeFileName = '';
      let resumePath = '';

      // Handle resume upload if provided
      if (resumeFile) {
        const timestamp = Date.now();
        const extension = resumeFile.name.split('.').pop();
        resumeFileName = `resume_${timestamp}.${extension}`;
        resumePath = `resumes/${resumeFileName}`;
        
        // In production, this would upload to your file storage
        console.log(`Resume would be saved to: ${resumePath}`);
      }

      const newApplication: ApplicationData = {
        ...applicationData,
        id: this.generateId(),
        applicationDate: new Date().toISOString(),
        status: 'pending',
        resumeFileName,
        resumePath
      };
      
      applications.push(newApplication);
      this.saveAllApplications(applications);
      
      console.log('Application saved:', newApplication);
      return newApplication;
    } catch (error) {
      console.error('Error saving application:', error);
      throw error;
    }
  }

  public async loadApplications(): Promise<ApplicationData[]> {
    try {
      if (this.cachedApplications) {
        return this.cachedApplications;
      }

      const response = await fetch(APPLICATIONS_FILE_URL);
      if (!response.ok) {
        console.warn('Could not load applications file');
        this.cachedApplications = [];
        return [];
      }
      
      const applications = await response.json();
      this.cachedApplications = applications;
      return applications;
    } catch (error) {
      console.error('Error loading applications:', error);
      this.cachedApplications = [];
      return [];
    }
  }

  private saveAllApplications(applications: ApplicationData[]): void {
    this.cachedApplications = applications;
    console.log('Applications updated in memory. Download the updated JSON file to replace public/data/applications.json');
    this.createDownloadableJSON(applications);
  }

  private createDownloadableJSON(applications: ApplicationData[]): void {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.json';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  public async getApplicationsByOpening(openingId: string): Promise<ApplicationData[]> {
    const applications = await this.loadApplications();
    return applications.filter(app => app.openingId === openingId);
  }

  public async updateApplicationStatus(id: string, status: ApplicationData['status']): Promise<void> {
    const applications = await this.loadApplications();
    const application = applications.find(app => app.id === id);
    if (application) {
      application.status = status;
      this.saveAllApplications(applications);
    }
  }

  public async deleteApplication(id: string): Promise<void> {
    const applications = await this.loadApplications();
    const filteredApplications = applications.filter(app => app.id !== id);
    this.saveAllApplications(filteredApplications);
  }

  public validateResumeFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      throw new Error('Resume file size too large. Maximum 5MB allowed.');
    }
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
    }
    
    return true;
  }

  public clearCache(): void {
    this.cachedApplications = null;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
