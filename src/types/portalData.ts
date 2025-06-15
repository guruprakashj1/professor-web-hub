
export interface About {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  email: string;
  phone: string;
  profileImage: string;
  location: string;
  officeHours: string;
  linkedin: string;
  researchGate: string;
  contact: {
    email: string;
    phone: string;
    office: string;
    officeHours: string;
  };
  socialLinks: {
    linkedin: string;
    researchGate: string;
    googleScholar: string;
    orcid: string;
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  year: string;
  description: string;
  advisor?: string;
  achievements: string[];
  universityLogo?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  term: string;
  year: string;
  description: string;
  syllabus: string;
  credits: number;
  prerequisites: string[];
  outcomes: string[];
  schedule: {
    days: string[];
    time: string;
    location: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  category: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  collaborators: string[];
  publications: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  doi: string;
  abstract: string;
  keywords: string[];
  citations: number;
  type: string;
  status: string;
}

export interface Opening {
  id: string;
  title: string;
  type: 'PhD' | 'Postdoc' | 'Research Assistant' | 'Visiting Scholar';
  description: string;
  requirements: string[];
  deadline: string;
  startDate: string;
  funding: string;
  applicationUrl: string;
  contactEmail: string;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  mediaType: 'photo' | 'video';
  photo?: string;
  video?: string;
  uploadType?: string;
  date: string;
  eventType?: string;
  location: string | {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  tags: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readingTime: number;
  keywords: string[];
  categoryId?: string;
  status: 'Draft' | 'Published';
  featuredImage?: string;
  videoUrl?: string;
}

export interface PortalData {
  about: About;
  education: EducationItem[];
  courses: Course[];
  projects: Project[];
  research: ResearchPaper[];
  openings: Opening[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
}
