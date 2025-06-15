
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Quote, Calendar, Users } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import ResearchWordCloud from './WordCloud';

const ResearchSection = () => {
  const { data, loading, error } = usePortalData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-light text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground font-light">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  const research = data?.research || [];

  // Combine all research text for word cloud
  const allResearchText = research
    .map(paper => `${paper.title} ${paper.abstract} ${paper.keywords?.join(' ') || ''}`)
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-foreground mb-8 text-center">Research Papers</h2>
        
        {research.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <div className="text-xl mb-4 font-light">No research papers available</div>
            <p className="font-light">Published research and academic publications will be displayed here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Word Cloud Section */}
            <ResearchWordCloud 
              text={allResearchText} 
              title="Research Topics Overview"
            />

            {/* Research Papers */}
            {research.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-all duration-300 border border-border hover:border-primary bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-card-foreground mb-2 font-light">{paper.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-light">{paper.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Quote className="w-4 h-4" />
                          <span className="font-light">{paper.citations} citations</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span className="font-light">{paper.authors.length} authors</span>
                        </div>
                      </div>
                      <p className="text-lg font-light text-card-foreground">{paper.journal}</p>
                    </div>
                    {paper.doi && (
                      <Button size="sm" variant="outline" asChild className="border-border text-muted-foreground hover:text-card-foreground hover:border-primary font-light">
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
                    <h4 className="font-light text-card-foreground mb-2">Authors</h4>
                    <div className="flex flex-wrap gap-2">
                      {paper.authors.map((author, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-card-foreground rounded text-sm font-light border border-border"
                        >
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div>
                    <h4 className="font-light text-card-foreground mb-2">Abstract</h4>
                    <p className="text-muted-foreground leading-relaxed font-light">{paper.abstract}</p>
                  </div>

                  {/* Keywords */}
                  {paper.keywords && paper.keywords.length > 0 && (
                    <div>
                      <h4 className="font-light text-card-foreground mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {paper.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted text-card-foreground rounded text-sm font-light border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {paper.doi && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground font-light">
                        <strong className="font-medium">DOI:</strong> {paper.doi}
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
