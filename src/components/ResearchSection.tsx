
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Quote, Calendar, Users } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const ResearchSection = () => {
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

  const research = data?.research || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Research Papers</h2>
        
        {research.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-xl mb-4">No research papers available</div>
            <p>Published research and academic publications will be displayed here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {research.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">{paper.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{paper.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Quote className="w-4 h-4" />
                          <span>{paper.citations} citations</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{paper.authors.length} authors</span>
                        </div>
                      </div>
                      <p className="text-lg font-medium text-blue-600">{paper.journal}</p>
                    </div>
                    {paper.doi && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          DOI
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Authors */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Authors</h4>
                    <div className="flex flex-wrap gap-2">
                      {paper.authors.map((author, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Abstract</h4>
                    <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
                  </div>

                  {/* Keywords */}
                  {paper.keywords && paper.keywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {paper.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {paper.doi && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>DOI:</strong> {paper.doi}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchSection;
