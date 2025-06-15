
export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string;
  description: string;
  advisor?: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  collaborators: number;
  status: 'Completed' | 'In Progress' | 'On Hold';
  achievements: string[];
  links: {
    demo?: string;
    github?: string;
    paper?: string;
    video?: string;
  };
}

export interface Textbook {
  title: string;
  author: string;
  edition: string;
  isbn?: string;
}

export interface CourseLink {
  name: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: 'Undergraduate' | 'Graduate';
  credits: number;
  semester: string;
  enrollment: number;
  maxEnrollment: number;
  description: string;
  learningOutcomes: string[];
  schedule: {
    days: string;
    time: string;
    location: string;
  };
  lessons: Lesson[];
  online?: boolean;
  industry?: string;
  textbooks?: Textbook[];
  softwareTools?: string[];
  courseLinks?: CourseLink[];
}

export interface Lesson {
  week: number;
  title: string;
  topics: string[];
  resources: Resource[];
}

export interface Resource {
  name: string;
  url: string;
  type?: 'learning' | 'download' | 'video' | 'document';
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
  citations: number;
}

export interface ProjectOpening {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  duration: string;
  type: 'Research' | 'Thesis' | 'Independent Study';
  level: 'Undergraduate' | 'Graduate' | 'PhD';
  status: 'Open' | 'Filled' | 'Closed';
  applicationDeadline: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  author: string;
  publishDate: string;
  lastModified: string;
  status: 'Draft' | 'Published';
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  videoUrl?: string;
  readingTime: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  mediaType: 'photo' | 'video';
  photo?: string;
  video?: string;
  uploadType: 'url' | 'upload';
  date: string;
  eventType: 'Meeting' | 'Conference' | 'Session' | 'Workshop' | 'Seminar' | 'Other';
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  tags: string[];
}

export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  profilePicture?: string;
  contact: {
    email: string;
    phone?: string;
    office: string;
    officeHours: string;
  };
  socialLinks: {
    linkedin?: string;
    researchGate?: string;
    googleScholar?: string;
    orcid?: string;
  };
}

export interface PortalData {
  about: AboutInfo;
  education: EducationItem[];
  certifications: Certification[];
  projects: Project[];
  courses: Course[];
  research: ResearchPaper[];
  openings: ProjectOpening[];
  blogs: BlogPost[];
  gallery: GalleryItem[];
}
