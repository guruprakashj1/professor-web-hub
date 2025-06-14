
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Users, FileText } from 'lucide-react';

const ResearchSection = () => {
  const papers = [
    {
      title: 'Adaptive Learning Systems: A Comprehensive Survey of Machine Learning Applications in Education',
      authors: ['Professor Name', 'Dr. Jane Smith', 'Dr. Robert Johnson'],
      journal: 'IEEE Transactions on Education',
      year: 2023,
      volume: '66',
      issue: '2',
      pages: '123-145',
      doi: '10.1109/TE.2023.1234567',
      abstract: 'This paper provides a comprehensive survey of machine learning applications in adaptive learning systems, examining current trends, challenges, and future directions in personalized education technology.',
      keywords: ['Machine Learning', 'Adaptive Learning', 'Educational Technology', 'Personalized Learning'],
      citations: 47,
      status: 'Published',
      type: 'Journal Article',
      links: {
        pdf: '#',
        doi: 'https://doi.org/10.1109/TE.2023.1234567',
        bibtex: '#'
      }
    },
    {
      title: 'Blockchain-Based Academic Credential Verification: A Decentralized Approach',
      authors: ['Professor Name', 'Dr. Alice Chen', 'Graduate Student Mike Wilson'],
      conference: 'ACM Conference on Computer and Communications Security',
      year: 2023,
      pages: '456-468',
      doi: '10.1145/3576915.3623456',
      abstract: 'We present a novel blockchain-based system for academic credential verification that ensures security, privacy, and interoperability across educational institutions.',
      keywords: ['Blockchain', 'Academic Credentials', 'Verification', 'Security'],
      citations: 23,
      status: 'Published',
      type: 'Conference Paper',
      links: {
        pdf: '#',
        doi: 'https://doi.org/10.1145/3576915.3623456',
        slides: '#'
      }
    },
    {
      title: 'IoT-Enabled Smart Campus: Energy Optimization and Sustainability Metrics',
      authors: ['Professor Name', 'Dr. Sarah Davis', 'Dr. Michael Brown', 'Graduate Student Lisa Park'],
      journal: 'Journal of Sustainable Computing',
      year: 2022,
      volume: '15',
      pages: '78-92',
      doi: '10.1016/j.suscom.2022.100456',
      abstract: 'This study presents an IoT-based smart campus system that optimizes energy consumption and provides comprehensive sustainability metrics for educational institutions.',
      keywords: ['IoT', 'Smart Campus', 'Energy Optimization', 'Sustainability'],
      citations: 35,
      status: 'Published',
      type: 'Journal Article',
      links: {
        pdf: '#',
        doi: 'https://doi.org/10.1016/j.suscom.2022.100456',
        data: '#'
      }
    },
    {
      title: 'Virtual Reality in STEM Education: Effectiveness and Student Engagement Analysis',
      authors: ['Professor Name', 'Dr. Emily Rodriguez', 'Graduate Student Tom Anderson'],
      journal: 'Computers & Education',
      year: 2022,
      volume: '180',
      pages: '104-120',
      doi: '10.1016/j.compedu.2022.104567',
      abstract: 'An empirical study examining the effectiveness of virtual reality applications in STEM education and their impact on student engagement and learning outcomes.',
      keywords: ['Virtual Reality', 'STEM Education', 'Student Engagement', 'Learning Outcomes'],
      citations: 62,
      status: 'Published',
      type: 'Journal Article',
      links: {
        pdf: '#',
        doi: 'https://doi.org/10.1016/j.compedu.2022.104567',
        video: '#'
      }
    },
    {
      title: 'Federated Learning for Privacy-Preserving Educational Data Mining',
      authors: ['Professor Name', 'Dr. Kevin Lee', 'Graduate Student Anna Zhang'],
      conference: 'International Conference on Artificial Intelligence in Education',
      year: 2024,
      status: 'Under Review',
      type: 'Conference Paper',
      abstract: 'We propose a federated learning framework for educational data mining that preserves student privacy while enabling collaborative model training across institutions.',
      keywords: ['Federated Learning', 'Privacy', 'Educational Data Mining', 'Collaborative Learning']
    },
    {
      title: 'Quantum Computing Applications in Cryptographic Education',
      authors: ['Professor Name', 'Dr. Rachel Green', 'Graduate Student David Kim'],
      journal: 'ACM Computing Surveys',
      year: 2024,
      status: 'In Preparation',
      type: 'Survey Article',
      abstract: 'A comprehensive survey of quantum computing applications in cryptographic education, examining current pedagogical approaches and future opportunities.',
      keywords: ['Quantum Computing', 'Cryptography', 'Education', 'Pedagogy']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Preparation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Journal Article':
        return 'bg-purple-100 text-purple-800';
      case 'Conference Paper':
        return 'bg-indigo-100 text-indigo-800';
      case 'Survey Article':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Research Papers</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore my published research contributions in computer science, education technology, and related fields.
        </p>

        {/* Research Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {papers.filter(p => p.status === 'Published').length}
              </div>
              <div className="text-sm text-gray-600">Published Papers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {papers.reduce((sum, paper) => sum + (paper.citations || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Citations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {papers.filter(p => p.status === 'Under Review').length}
              </div>
              <div className="text-sm text-gray-600">Under Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {papers.filter(p => p.status === 'In Preparation').length}
              </div>
              <div className="text-sm text-gray-600">In Preparation</div>
            </CardContent>
          </Card>
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {papers.map((paper, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(paper.status)}>
                        {paper.status}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(paper.type)}>
                        {paper.type}
                      </Badge>
                      {paper.citations && (
                        <Badge variant="outline">
                          {paper.citations} citations
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      {paper.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{paper.authors.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{paper.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Publication Details */}
                <div className="text-sm text-gray-700">
                  {paper.journal && (
                    <p><strong>Journal:</strong> {paper.journal}</p>
                  )}
                  {paper.conference && (
                    <p><strong>Conference:</strong> {paper.conference}</p>
                  )}
                  {paper.volume && (
                    <p><strong>Volume:</strong> {paper.volume}{paper.issue && `, Issue ${paper.issue}`}</p>
                  )}
                  {paper.pages && (
                    <p><strong>Pages:</strong> {paper.pages}</p>
                  )}
                  {paper.doi && (
                    <p><strong>DOI:</strong> {paper.doi}</p>
                  )}
                </div>

                {/* Abstract */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Abstract</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{paper.abstract}</p>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, keyIndex) => (
                      <span
                        key={keyIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {paper.links && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {paper.links.pdf && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    )}
                    {paper.links.doi && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        DOI
                      </Button>
                    )}
                    {paper.links.slides && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Slides
                      </Button>
                    )}
                    {paper.links.video && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Video
                      </Button>
                    )}
                    {paper.links.data && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Data
                      </Button>
                    )}
                    {paper.links.bibtex && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        BibTeX
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchSection;
