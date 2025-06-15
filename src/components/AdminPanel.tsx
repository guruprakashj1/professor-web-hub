
import { useState } from 'react';
import { X, User, GraduationCap, Briefcase, BookOpen, FileText, Users, Download, Upload, RotateCcw, PenTool, Camera, MessageCircle, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLogin from './AdminLogin';
import AboutEditor from './admin/AboutEditor';
import EducationEditor from './admin/EducationEditor';
import ProjectsEditor from './admin/ProjectsEditor';
import CoursesEditor from './admin/CoursesEditor';
import ResearchEditor from './admin/ResearchEditor';
import OpeningsEditor from './admin/OpeningsEditor';
import BlogsEditor from './admin/BlogsEditor';
import GalleryEditor from './admin/GalleryEditor';
import ContactMessagesEditor from './admin/ContactMessagesEditor';
import ThemeSelector from './admin/ThemeSelector';
import { useFirebasePortalData } from '@/hooks/useFirebasePortalData';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const { exportData, importData, resetData } = useFirebasePortalData();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `professor-portal-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your portal data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importData(content);
        toast({
          title: "Data Imported",
          description: "Your portal data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      try {
        resetData();
        toast({
          title: "Data Reset",
          description: "All portal data has been reset to defaults.",
        });
      } catch (error) {
        toast({
          title: "Reset Failed",
          description: "Failed to reset data. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-600">Manage your portal content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-10 h-12">
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Research</span>
              </TabsTrigger>
              <TabsTrigger value="openings" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Openings</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <TabsContent value="about" className="mt-0">
                <AboutEditor />
              </TabsContent>
              <TabsContent value="education" className="mt-0">
                <EducationEditor />
              </TabsContent>
              <TabsContent value="projects" className="mt-0">
                <ProjectsEditor />
              </TabsContent>
              <TabsContent value="courses" className="mt-0">
                <CoursesEditor />
              </TabsContent>
              <TabsContent value="research" className="mt-0">
                <ResearchEditor />
              </TabsContent>
              <TabsContent value="openings" className="mt-0">
                <OpeningsEditor />
              </TabsContent>
              <TabsContent value="gallery" className="mt-0">
                <GalleryEditor />
              </TabsContent>
              <TabsContent value="contact" className="mt-0">
                <ContactMessagesEditor />
              </TabsContent>
              <TabsContent value="blog" className="mt-0">
                <BlogsEditor />
              </TabsContent>
              <TabsContent value="theme" className="mt-0">
                <ThemeSelector />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
