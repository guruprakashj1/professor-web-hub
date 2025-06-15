export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  lastModified: string;
  status: 'Draft' | 'Published';
  keywords: string[];
  readingTime: number;
  featuredImage?: string;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string; // Add categoryId field
}

export interface About {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  profileImage: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    orcid?: string;
    googleScholar?: string;
  };
  researchInterests: string[];
  officeHours: string;
  cv: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description: string;
  location: string;
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Ongoing' | 'Completed' | 'Planned';
  startDate: string;
  endDate?: string;
  technologies: string[];
  role: string;
  funding?: string;
  collaborators: string[];
  outcomes: string[];
  repository?: string;
  website?: string;
  publications: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  level: 'Undergraduate' | 'Graduate';
  credits: number;
  semester: string;
  year: string;
  syllabus?: string;
  materials: string[];
  prerequisites: string[];
  objectives: string[];
  schedule: string;
  enrollment: number;
  maxEnrollment: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  doi?: string;
  abstract: string;
  keywords: string[];
  type: 'Journal' | 'Conference' | 'Book Chapter' | 'Preprint';
  status: 'Published' | 'In Press' | 'Under Review' | 'In Preparation';
  citations?: number;
  url?: string;
  pdf?: string;
  bibtex?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  type: 'PhD' | 'Postdoc' | 'Research Assistant' | 'Visiting Scholar';
  duration: string;
  startDate: string;
  applicationDeadline: string;
  funding: string;
  location: string;
  qualifications: string[];
  contact: string;
  status: 'Open' | 'Closed' | 'Filled';
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Research' | 'Teaching' | 'Conference' | 'Lab' | 'Awards' | 'Other';
  date: string;
  tags: string[];
  caption?: string;
  location?: string;
}

export interface PortalData {
  about: About;
  education: EducationItem[];
  projects: Project[];
  courses: Course[];
  research: ResearchPaper[];
  openings: JobOpening[];
  blogs: BlogPost[];
  gallery: GalleryItem[];
}
