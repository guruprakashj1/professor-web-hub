
export interface About {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  email: string;
  phone: string;
  profileImage: string;
  profilePicture?: string; // Alternative property name used in components
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
  socialLinks?: {
    linkedin?: string;
    researchGate?: string;
    googleScholar?: string;
    orcid?: string;
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

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
  description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  materials: string[];
  week: number;
  topics?: string[];
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  name?: string; // Alternative property name
  type: string;
  url: string;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  title?: string; // Alternative property name
  code: string;
  term: string;
  year: string;
  semester?: string; // Additional property
  description: string;
  syllabus: string;
  credits: number;
  level?: string; // e.g., 'Graduate', 'Undergraduate'
  prerequisites: string[];
  outcomes: string[];
  learningOutcomes?: string[]; // Alternative property name
  lessons?: Lesson[];
  textbooks?: string[] | Array<{ title: string; author: string; edition: string; isbn: string; }>;
  softwareTools?: string[];
  courseLinks?: Array<{ title: string; url: string }>;
  enrollment?: number;
  maxEnrollment?: number;
  industry?: string; // Additional property for industry relevance
  online?: boolean; // Additional property for online availability
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
  duration?: string; // Alternative property for displaying duration
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  category: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  collaborators: string[];
  publications: string[];
  achievements?: string[];
  links?: {
    demo?: string;
    github?: string;
    paper?: string;
    video?: string;
  };
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
  level?: string; // Additional property for level classification
  description: string;
  requirements: string[];
  deadline: string;
  applicationDeadline?: string; // Alternative property name
  startDate: string;
  duration?: string;
  funding: string;
  applicationUrl: string;
  contactEmail: string;
  isActive: boolean;
  status?: string; // e.g., 'Open', 'Closed', 'Filled'
}

// Export alias for OpeningsEditor compatibility
export type ProjectOpening = Opening;

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
  location: {
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
  lastModified?: string; // Additional property for admin
  seoTitle?: string; // Additional property for SEO
  seoDescription?: string; // Additional property for SEO
}

// Export alias for compatibility with admin components
export type AboutInfo = About;

export interface PortalData {
  about: About;
  education: EducationItem[];
  certifications: Certification[]; // Add missing certifications property
  courses: Course[];
  projects: Project[];
  research: ResearchPaper[];
  openings: Opening[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
}
