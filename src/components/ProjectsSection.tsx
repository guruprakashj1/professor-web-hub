
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, Users, FileText, Play } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const ProjectsSection = () => {
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

  const projects = data?.projects || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Projects</h2>
        
        {projects.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-xl mb-4">No projects available</div>
            <p>Check back later for updates on ongoing projects and research.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project.collaborators} collaborators</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  
                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  {project.achievements && project.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {project.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700 text-sm">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.links.demo && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.links.paper && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links.paper} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-1" />
                          Paper
                        </a>
                      </Button>
                    )}
                    {project.links.video && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links.video} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Video
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
