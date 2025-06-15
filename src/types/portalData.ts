
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
  categoryId?: string;
}

export interface About {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  profileImage: string;
  location: string;
  profilePicture?: string;
  contact?: {
    email?: string;
    phone?: string;
    office?: string;
    officeHours?: string;
  };
  expertise?: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  researchInterests: string[];
  officeHours: string;
  cv: string;
}

// Update AboutInfo to match About interface properly
export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  location?: string;
  profilePicture?: string;
  expertise?: string[];
  contact?: {
    email?: string;
    phone?: string;
    office?: string;
    officeHours?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  researchInterests?: string[];
  officeHours?: string;
  cv?: string;
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
  year?: string;
  advisor?: string;
  universityLogo?: string;
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
  status: 'Ongoing' | 'Completed' | 'Planned' | 'In Progress';
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
  duration?: string;
  achievements?: string[];
  links?: {
    demo?: string;
    github?: string;
    paper?: string;
    video?: string;
  };
}

export interface ProjectOpening {
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
  level?: string;
}

// Update Lesson interface to include missing properties
export interface Lesson {
  id?: string;
  week: number;
  title: string;
  description?: string;
  topics: string[];
  resources: Resource[];
  materials?: Resource[];
}

// Update Resource interface
export interface Resource {
  id?: string;
  name: string;
  title?: string;
  type: 'PDF' | 'Video' | 'Link' | 'Assignment' | 'learning' | 'download' | 'video' | 'document';
  url: string;
}

// Update Course interface to match component usage
export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  level: 'Undergraduate' | 'Graduate';
  credits: number;
  semester: string;
  year?: string;
  syllabus?: string;
  materials?: string[];
  prerequisites?: string[];
  objectives?: string[];
  schedule: {
    days: string;
    time: string;
    location: string;
  };
  enrollment: number;
  maxEnrollment: number;
  learningOutcomes?: string[];
  lessons?: Lesson[];
  textbooks?: Array<{
    title: string;
    author: string;
    edition: string;
    isbn: string;
  }>;
  softwareTools?: string[];
  online?: boolean;
  industry?: string;
  courseLinks?: Array<{
    name: string;
    url: string;
  }>;
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
  level?: string;
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
  location?: string | { 
    name: string;
    latitude?: number;
    longitude?: number;
  };
  mediaType?: 'photo' | 'video';
  eventType?: string;
  photo?: string;
  video?: string;
  uploadType?: string;
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
  certifications?: Certification[];
}
