
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ApplicationData } from '@/types/application';

const APPLICATIONS_COLLECTION = 'applications';

export class FirebaseApplicationStorageService {
  private static instance: FirebaseApplicationStorageService;
  private cachedApplications: ApplicationData[] | null = null;
  
  public static getInstance(): FirebaseApplicationStorageService {
    if (!FirebaseApplicationStorageService.instance) {
      FirebaseApplicationStorageService.instance = new FirebaseApplicationStorageService();
    }
    return FirebaseApplicationStorageService.instance;
  }

  public async saveApplication(
    applicationData: Omit<ApplicationData, 'id' | 'applicationDate' | 'status' | 'resumePath' | 'resumeFileName'>,
    resumeFile?: File
  ): Promise<ApplicationData> {
    try {
      let resumeFileName = '';
      let resumePath = '';

      // Handle resume upload if provided
      if (resumeFile) {
        const timestamp = Date.now();
        const extension = resumeFile.name.split('.').pop();
        resumeFileName = `resume_${timestamp}.${extension}`;
        resumePath = `resumes/${resumeFileName}`;
        
        // In production, this would upload to Firebase Storage
        console.log(`Resume would be saved to Firebase Storage: ${resumePath}`);
      }

      const newApplication: Omit<ApplicationData, 'id'> = {
        ...applicationData,
        applicationDate: new Date().toISOString(),
        status: 'pending',
        resumeFileName,
        resumePath
      };
      
      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), newApplication);
      const savedApplication = { ...newApplication, id: docRef.id } as ApplicationData;
      
      // Update cache
      if (this.cachedApplications) {
        this.cachedApplications.push(savedApplication);
      }
      
      console.log('Application saved to Firebase:', savedApplication);
      return savedApplication;
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

      const q = query(collection(db, APPLICATIONS_COLLECTION), orderBy('applicationDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const applications: ApplicationData[] = [];
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as ApplicationData);
      });
      
      this.cachedApplications = applications;
      return applications;
    } catch (error) {
      console.error('Error loading applications:', error);
      this.cachedApplications = [];
      return [];
    }
  }

  public async getApplicationsByOpening(openingId: string): Promise<ApplicationData[]> {
    try {
      const applications = await this.loadApplications();
      return applications.filter(app => app.openingId === openingId);
    } catch (error) {
      console.error('Error getting applications by opening:', error);
      return [];
    }
  }

  public async updateApplicationStatus(id: string, status: ApplicationData['status']): Promise<void> {
    try {
      const applicationRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(applicationRef, { status });
      
      // Update cache
      if (this.cachedApplications) {
        const application = this.cachedApplications.find(app => app.id === id);
        if (application) {
          application.status = status;
        }
      }
      
      console.log('Application status updated:', { id, status });
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  public async deleteApplication(id: string): Promise<void> {
    try {
      const applicationRef = doc(db, APPLICATIONS_COLLECTION, id);
      await deleteDoc(applicationRef);
      
      // Update cache
      if (this.cachedApplications) {
        this.cachedApplications = this.cachedApplications.filter(app => app.id !== id);
      }
      
      console.log('Application deleted:', id);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
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
}
