
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, GraduationCap, Calendar, AlertCircle } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const OpeningsSection = () => {
  const { data, loading, error } = usePortalData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  const openings = data?.openings || [];
  const activeOpenings = openings.filter(opening => opening.status === 'Open');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Openings</h2>
        
        {openings.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-xl mb-4">No project openings available</div>
            <p>Please check back later for new research opportunities and project openings.</p>
          </div>
        ) : (
          <>
            {activeOpenings.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-green-600" />
                  Currently Available Opportunities
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeOpenings.map((opening) => (
                    <OpeningCard key={opening.id} opening={opening} />
                  ))}
                </div>
              </div>
            )}

            {openings.filter(opening => opening.status !== 'Open').length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Previous Opportunities</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {openings
                    .filter(opening => opening.status !== 'Open')
                    .map((opening) => (
                      <OpeningCard key={opening.id} opening={opening} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const OpeningCard = ({ opening }: { opening: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Filled':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PhD':
        return 'bg-purple-100 text-purple-800';
      case 'Graduate':
        return 'bg-blue-100 text-blue-800';
      case 'Undergraduate':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${
      opening.status === 'Open' ? 'ring-2 ring-green-200' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 mb-2">{opening.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(opening.status)}>
                {opening.status}
              </Badge>
              <Badge variant="outline">{opening.type}</Badge>
              <Badge className={getLevelColor(opening.level)}>
                {opening.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{opening.description}</p>
        
        {/* Duration and Deadline */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{opening.duration}</span>
          </div>
          {opening.applicationDeadline && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Deadline: {new Date(opening.applicationDeadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Requirements */}
        {opening.requirements && opening.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              Requirements
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {opening.requirements.map((requirement: string, index: number) => (
                <li key={index} className="text-gray-700 text-sm">{requirement}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpeningsSection;
