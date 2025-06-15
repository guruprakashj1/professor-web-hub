
import { useState } from 'react';
import { Book, GraduationCap, Users, FileText, Briefcase, BookOpen, PenTool, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import ProjectsSection from '@/components/ProjectsSection';
import CoursesSection from '@/components/CoursesSection';
import ResearchSection from '@/components/ResearchSection';
import OpeningsSection from '@/components/OpeningsSection';
import BlogSection from '@/components/BlogSection';
import GallerySection from '@/components/GallerySection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />;
      case 'education':
        return <EducationSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'courses':
        return <CoursesSection />;
      case 'research':
        return <ResearchSection />;
      case 'openings':
        return <OpeningsSection />;
      case 'gallery':
        return <GallerySection />;
      case 'blog':
        return <BlogSection />;
      default:
        return <HeroSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="pt-20">
        {renderSection()}
      </main>
    </div>
  );
};

const HeroSection = ({ setActiveSection }: { setActiveSection: (section: string) => void }) => {
  const sections = [
    {
      id: 'about',
      title: 'About Me',
      description: 'Learn about my academic journey and expertise',
      icon: Users,
    },
    {
      id: 'education',
      title: 'Education',
      description: 'My educational background and qualifications',
      icon: GraduationCap,
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Academic and research projects I have accomplished',
      icon: Briefcase,
    },
    {
      id: 'courses',
      title: 'Courses',
      description: 'Courses I teach and offer to students',
      icon: BookOpen,
    },
    {
      id: 'research',
      title: 'Research Papers',
      description: 'Published research and academic publications',
      icon: FileText,
    },
    {
      id: 'openings',
      title: 'Project Openings',
      description: 'Available research opportunities for students',
      icon: Book,
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Photos from conferences, meetings, and academic events',
      icon: Camera,
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Insights, research updates, and thoughts on education',
      icon: PenTool,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <img 
          src="/lovable-uploads/f4647ff3-b777-4579-abaa-37568921101b.png" 
          alt="Guruprakash J [GJ] - Academic Portal"
          className="w-full max-w-4xl mx-auto rounded-lg shadow-lg mb-6 animate-fade-in grayscale"
        />
        <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in font-light" style={{
          animationDelay: '0.2s',
          animationFillMode: 'both'
        }}>
          Welcome to my academic portal. Explore my research, courses, and contributions to the field of education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card
              key={section.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in border border-gray-200 hover:border-black bg-white"
              style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-gray-800">
                  <IconComponent className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-xl font-light text-gray-900 group-hover:text-black transition-colors duration-300">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300 font-light">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
