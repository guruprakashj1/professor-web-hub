import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApplicationStorageService } from '@/utils/applicationStorage';
import { ApplicationData } from '@/types/application';
import { toast } from '@/hooks/use-toast';
import { Eye, Download, Check, X, Clock, User } from 'lucide-react';

interface ApplicationsViewerProps {
  openingId: string;
  openingTitle: string;
  onClose: () => void;
}

const ApplicationsViewer = ({ openingId, openingTitle, onClose }: ApplicationsViewerProps) => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const applicationService = ApplicationStorageService.getInstance();

  useEffect(() => {
    loadApplications();
  }, [openingId]);

  const loadApplications = async () => {
    const apps = await applicationService.getApplicationsByOpening(openingId);
    setApplications(apps);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationData['status']) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      loadApplications();
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: ApplicationData['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: ApplicationData['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <Eye className="w-4 h-4" />;
      case 'accepted':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (selectedApplication) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl">Application Details</CardTitle>
              <p className="text-gray-600 mt-1">{selectedApplication.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="max-h-[70vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{selectedApplication.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{selectedApplication.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">{selectedApplication.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Application Date</label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedApplication.applicationDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Qualifications</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedApplication.qualifications}</p>
            </div>

            {selectedApplication.portfolioUrl && (
              <div>
                <label className="text-sm font-medium text-gray-700">Portfolio URL</label>
                <p className="mt-1">
                  <a 
                    href={selectedApplication.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {selectedApplication.portfolioUrl}
                  </a>
                </p>
              </div>
            )}

            {selectedApplication.resumeFileName && (
              <div>
                <label className="text-sm font-medium text-gray-700">Resume</label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-gray-900">{selectedApplication.resumeFileName}</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-2 flex items-center space-x-2">
                <Badge className={`${getStatusColor(selectedApplication.status)} flex items-center space-x-1`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="capitalize">{selectedApplication.status}</span>
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={() => handleStatusUpdate(selectedApplication.id, 'reviewed')}
                variant="outline"
                disabled={selectedApplication.status === 'reviewed'}
              >
                Mark as Reviewed
              </Button>
              <Button 
                onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                className="bg-green-600 hover:bg-green-700"
                disabled={selectedApplication.status === 'accepted'}
              >
                Accept
              </Button>
              <Button 
                onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                variant="destructive"
                disabled={selectedApplication.status === 'rejected'}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Applications</CardTitle>
            <p className="text-gray-600 mt-1">{openingTitle}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="max-h-[70vh] overflow-y-auto">
          {applications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No applications received for this opening yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>
                      {new Date(application.applicationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1 w-fit`}>
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsViewer;
