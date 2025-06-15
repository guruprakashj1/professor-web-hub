
import { ApplicationData } from '@/types/application';

const STORAGE_KEY = 'opening_applications';
const RESUME_FOLDER = 'resumes';

export class ApplicationStorageService {
  private static instance: ApplicationStorageService;
  
  public static getInstance(): ApplicationStorageService {
    if (!ApplicationStorageService.instance) {
      ApplicationStorageService.instance = new ApplicationStorageService();
    }
    return ApplicationStorageService.instance;
  }

  public saveApplication(
    applicationData: Omit<ApplicationData, 'id' | 'applicationDate' | 'status' | 'resumePath' | 'resumeFileName'>,
    resumeFile?: File
  ): Promise<ApplicationData> {
    return new Promise(async (resolve, reject) => {
      try {
        const applications = this.loadApplications();
        let resumeFileName = '';
        let resumePath = '';

        // Handle resume upload if provided
        if (resumeFile) {
          const timestamp = Date.now();
          const extension = resumeFile.name.split('.').pop();
          resumeFileName = `resume_${timestamp}.${extension}`;
          resumePath = `${RESUME_FOLDER}/${resumeFileName}`;
          
          // Store resume file (in a real app, this would upload to cloud storage)
          await this.saveResumeFile(resumeFile, resumeFileName);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
        
        console.log('Application saved:', newApplication);
        resolve(newApplication);
      } catch (error) {
        console.error('Error saving application:', error);
        reject(error);
      }
    });
  }

  public loadApplications(): ApplicationData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading applications:', error);
      return [];
    }
  }

  public getApplicationsByOpening(openingId: string): ApplicationData[] {
    const applications = this.loadApplications();
    return applications.filter(app => app.openingId === openingId);
  }

  public updateApplicationStatus(id: string, status: ApplicationData['status']): void {
    const applications = this.loadApplications();
    const application = applications.find(app => app.id === id);
    if (application) {
      application.status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    }
  }

  public deleteApplication(id: string): void {
    const applications = this.loadApplications();
    const filteredApplications = applications.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredApplications));
  }

  private async saveResumeFile(file: File, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // Store the resume file info in localStorage for demo purposes
        const resumeFiles = JSON.parse(localStorage.getItem('resume_files') || '{}');
        resumeFiles[fileName] = {
          path: `${RESUME_FOLDER}/${fileName}`,
          dataUrl: dataUrl,
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          size: file.size,
          type: file.type
        };
        localStorage.setItem('resume_files', JSON.stringify(resumeFiles));
        
        console.log(`Resume uploaded: ${RESUME_FOLDER}/${fileName}`);
        resolve();
      };
      reader.onerror = () => reject(new Error('Failed to read resume file'));
      reader.readAsDataURL(file);
    });
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

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
