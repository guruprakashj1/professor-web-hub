
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortalData } from '@/hooks/usePortalData';
import { Settings, Download, Upload, RotateCcw, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AdminLogin from './AdminLogin';
import AboutEditor from './admin/AboutEditor';
import EducationEditor from './admin/EducationEditor';
import ProjectsEditor from './admin/ProjectsEditor';
import CoursesEditor from './admin/CoursesEditor';
import ResearchEditor from './admin/ResearchEditor';
import OpeningsEditor from './admin/OpeningsEditor';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { data, loading, error, exportData, importData, resetData, refreshData } = usePortalData();
  const [importText, setImportText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Refresh data when component mounts and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleExport = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'professor-portal-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Portal data has been exported successfully.",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    try {
      importData(importText);
      setImportText('');
      refreshData(); // Refresh after import
      toast({
        title: "Data Imported",
        description: "Portal data has been imported successfully.",
      });
    } catch (err) {
      toast({
        title: "Import Failed",
        description: "Invalid JSON data. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This action cannot be undone.')) {
      try {
        resetData();
        refreshData(); // Refresh after reset
        toast({
          title: "Data Reset",
          description: "Portal data has been reset to default values.",
        });
      } catch (err) {
        toast({
          title: "Reset Failed",
          description: "Failed to reset data.",
          variant: "destructive",
        });
      }
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {
              refreshData();
              toast({
                title: "Data Refreshed",
                description: "Portal data has been refreshed.",
              });
            }}>
              Refresh
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="about" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-7 m-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="openings">Openings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-4 pb-4">
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
              
              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-4">
                        <Button onClick={handleExport} className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Export Data</span>
                        </Button>
                        
                        <Button variant="destructive" onClick={handleReset} className="flex items-center space-x-2">
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset to Default</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Import Data (JSON)</label>
                        <textarea
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          placeholder="Paste JSON data here..."
                          className="w-full h-32 p-2 border border-gray-300 rounded-md"
                        />
                        <Button onClick={handleImport} disabled={!importText.trim()} className="flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Import Data</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
