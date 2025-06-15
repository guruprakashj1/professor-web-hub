
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, GraduationCap, Calendar, AlertCircle, Send } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import ApplicationForm from './ApplicationForm';

const OpeningsSection = () => {
  const { data, loading, error } = usePortalData();
  const [selectedOpening, setSelectedOpening] = useState<any>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-light text-gray-900">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-black font-light">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  const openings = data?.openings || [];
  const activeOpenings = openings.filter(opening => opening.status === 'Open');

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-black mb-8 text-center">Project Openings</h2>
          
          {openings.length === 0 ? (
            <div className="text-center text-gray-700 py-16">
              <div className="text-xl mb-4 font-light">No project openings available</div>
              <p className="font-light">Please check back later for new research opportunities and project openings.</p>
            </div>
          ) : (
            <>
              {activeOpenings.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-light text-gray-800 mb-6 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-2 text-black" />
                    Currently Available Opportunities
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeOpenings.map((opening) => (
                      <OpeningCard 
                        key={opening.id} 
                        opening={opening} 
                        onApply={() => setSelectedOpening(opening)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {openings.filter(opening => opening.status !== 'Open').length > 0 && (
                <div>
                  <h3 className="text-2xl font-light text-gray-800 mb-6">Previous Opportunities</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {openings
                      .filter(opening => opening.status !== 'Open')
                      .map((opening) => (
                        <OpeningCard 
                          key={opening.id} 
                          opening={opening}
                          onApply={() => setSelectedOpening(opening)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedOpening && (
        <ApplicationForm
          opening={selectedOpening}
          onClose={() => setSelectedOpening(null)}
        />
      )}
    </>
  );
};

const OpeningCard = ({ opening, onApply }: { opening: any; onApply: () => void }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-black text-white border-black';
      case 'Filled':
        return 'bg-gray-100 text-black border-gray-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PhD':
        return 'bg-gray-100 text-black border-gray-200';
      case 'Graduate':
        return 'bg-gray-100 text-black border-gray-200';
      case 'Undergraduate':
        return 'bg-gray-100 text-black border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black bg-white ${
      opening.status === 'Open' ? 'ring-2 ring-black' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-black mb-2 font-light">{opening.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`${getStatusColor(opening.status)} font-light border`}>
                {opening.status}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 font-light">{opening.type}</Badge>
              <Badge className={`${getLevelColor(opening.level)} font-light border`}>
                {opening.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 leading-relaxed font-light">{opening.description}</p>
        
        {/* Duration and Deadline */}
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="font-light">{opening.duration}</span>
          </div>
          {opening.applicationDeadline && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="font-light">Deadline: {new Date(opening.applicationDeadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Requirements */}
        {opening.requirements && opening.requirements.length > 0 && (
          <div>
            <h4 className="font-light text-black mb-2 flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              Requirements
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {opening.requirements.map((requirement: string, index: number) => (
                <li key={index} className="text-gray-800 text-sm font-light">{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply Button */}
        {opening.status === 'Open' && (
          <div className="pt-4">
            <Button 
              onClick={onApply}
              className="w-full bg-black text-white hover:bg-gray-800 font-light"
            >
              <Send className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpeningsSection;
