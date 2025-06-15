
export interface ApplicationData {
  id: string;
  openingId: string;
  openingTitle: string;
  name: string;
  phone: string;
  email: string;
  qualifications: string;
  portfolioUrl: string;
  resumeUrl?: string;
  resumeFileName: string;
  resumePath: string;
  applicationDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}
