
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

  const projects = data?.projects || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-black mb-8 text-center">Projects</h2>
        
        {projects.length === 0 ? (
          <div className="text-center text-gray-700 py-16">
            <div className="text-xl mb-4 font-light">No projects available</div>
            <p className="font-light">Check back later for updates on ongoing projects and research.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-black bg-white hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-black mb-2 font-light">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-light">{project.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span className="font-light">{project.collaborators} collaborators</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-light border ${
                      project.status === 'Completed' 
                        ? 'bg-gray-100 text-black border-gray-200'
                        : project.status === 'In Progress'
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800 leading-relaxed font-light">{project.description}</p>
                  
                  {/* Technologies */}
                  <div>
                    <h4 className="font-light text-black mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-black rounded text-sm font-light border border-gray-200 hover:bg-black hover:text-white transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  {project.achievements && project.achievements.length > 0 && (
                    <div>
                      <h4 className="font-light text-black mb-2">Key Achievements</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {project.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-800 text-sm font-light">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.links.demo && (
                      <Button size="sm" variant="outline" asChild className="border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button size="sm" variant="outline" asChild className="border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.links.paper && (
                      <Button size="sm" variant="outline" asChild className="border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
                        <a href={project.links.paper} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-1" />
                          Paper
                        </a>
                      </Button>
                    )}
                    {project.links.video && (
                      <Button size="sm" variant="outline" asChild className="border-gray-300 text-gray-700 hover:text-black hover:border-black font-light">
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
