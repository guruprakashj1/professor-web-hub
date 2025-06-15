
import { useState } from 'react';
import { Book, GraduationCap, Users, FileText, Briefcase, BookOpen, PenTool } from 'lucide-react';
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
      case 'blog':
        return <BlogSection />;
      default:
        return <HeroSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'education',
      title: 'Education',
      description: 'My educational background and qualifications',
      icon: GraduationCap,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Academic and research projects I have accomplished',
      icon: Briefcase,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'courses',
      title: 'Courses',
      description: 'Courses I teach and offer to students',
      icon: BookOpen,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'research',
      title: 'Research Papers',
      description: 'Published research and academic publications',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'openings',
      title: 'Project Openings',
      description: 'Available research opportunities for students',
      icon: Book,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Insights, research updates, and thoughts on education',
      icon: PenTool,
      color: 'bg-teal-500 hover:bg-teal-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
          Professor's Academic Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          Welcome to my academic portal. Explore my research, courses, and contributions to the field of education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card 
              key={section.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in hover:rotate-1"
              style={{ 
                animationDelay: `${0.4 + index * 0.1}s`, 
                animationFillMode: 'both' 
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${section.color} flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                  <IconComponent className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
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
