
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
  profilePicture?: string; // Add missing property
  contact?: { // Add missing contact object
    email?: string;
    phone?: string;
    office?: string;
    officeHours?: string;
  };
  expertise?: string[]; // Add missing property
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

// Add missing AboutInfo type for admin editor
export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  contact: {
    email: string;
    phone: string;
    office: string;
    officeHours: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
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
  year?: string; // Add missing property
  advisor?: string; // Add missing property
  universityLogo?: string; // Add missing property
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
  status: 'Ongoing' | 'Completed' | 'Planned' | 'In Progress'; // Add 'In Progress' status
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
  duration?: string; // Add missing property
  achievements?: string[]; // Add missing property
  links?: { // Add missing links object
    demo?: string;
    github?: string;
    paper?: string;
    video?: string;
  };
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
  year: string;
  syllabus?: string;
  materials: string[];
  prerequisites: string[];
  objectives: string[];
  schedule: {
    days: string;
    time: string;
    location: string;
  };
  enrollment: number;
  maxEnrollment: number;
  learningOutcomes?: string[]; // Add missing property
  lessons?: Lesson[]; // Add missing property
  textbooks?: string[]; // Add missing property
  softwareTools?: string[]; // Add missing property
}

// Add missing Lesson type
export interface Lesson {
  id: string;
  title: string;
  description: string;
  week: number;
  materials: Resource[];
}

// Add missing Resource type
export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Assignment';
  url: string;
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
  location?: string | { name: string }; // Allow both string and object
  mediaType?: 'photo' | 'video'; // Add missing property
  eventType?: string; // Add missing property
  photo?: string; // Add missing property
  video?: string; // Add missing property
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
  certifications?: Certification[]; // Add missing property
}
