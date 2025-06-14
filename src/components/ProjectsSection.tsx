
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, Users } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: 'AI-Powered Educational Platform',
      description: 'Developed an intelligent tutoring system that adapts to individual student learning patterns using machine learning algorithms.',
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB'],
      duration: '2022 - 2023',
      collaborators: 3,
      status: 'Completed',
      achievements: [
        'Improved student engagement by 40%',
        'Published in IEEE Transactions on Education',
        'Deployed at 5 universities'
      ],
      links: {
        demo: 'https://demo.example.com',
        github: 'https://github.com/professor/ai-education',
        paper: 'https://ieeexplore.ieee.org/document/123456'
      }
    },
    {
      title: 'Smart Campus IoT System',
      description: 'Designed and implemented a comprehensive IoT infrastructure for smart campus management, including energy monitoring and occupancy tracking.',
      technologies: ['Arduino', 'Raspberry Pi', 'Python', 'LoRaWAN', 'AWS IoT'],
      duration: '2021 - 2022',
      collaborators: 5,
      status: 'Completed',
      achievements: [
        'Reduced energy consumption by 25%',
        'Real-time monitoring of 50+ buildings',
        'Grant funding of $500,000'
      ],
      links: {
        demo: 'https://smartcampus.example.com',
        paper: 'https://dl.acm.org/doi/10.1145/123456'
      }
    },
    {
      title: 'Blockchain-Based Academic Credentials',
      description: 'Developing a secure, decentralized system for issuing and verifying academic credentials using blockchain technology.',
      technologies: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'IPFS'],
      duration: '2023 - Present',
      collaborators: 4,
      status: 'In Progress',
      achievements: [
        'Prototype deployed on testnet',
        'Partnership with 3 universities',
        'NSF grant proposal submitted'
      ],
      links: {
        github: 'https://github.com/professor/blockchain-credentials'
      }
    },
    {
      title: 'Virtual Reality Lab Simulations',
      description: 'Created immersive VR experiences for chemistry and physics lab experiments, allowing students to conduct experiments safely.',
      technologies: ['Unity', 'C#', 'Oculus SDK', 'Blender', 'Firebase'],
      duration: '2020 - 2021',
      collaborators: 6,
      status: 'Completed',
      achievements: [
        'Used by 1000+ students',
        'Winner of Innovation in Education Award',
        'Licensed to educational publishers'
      ],
      links: {
        demo: 'https://vrlab.example.com',
        video: 'https://youtube.com/watch?v=example'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Projects Accomplished</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore the innovative projects I've worked on, from AI-powered educational tools to cutting-edge research implementations.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-gray-900 mb-2">{project.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600">{project.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Duration and Collaborators */}
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

                {/* Technologies */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {project.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {project.links.demo && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  )}
                  {project.links.github && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <Github className="w-3 h-3 mr-1" />
                      GitHub
                    </Button>
                  )}
                  {project.links.paper && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Paper
                    </Button>
                  )}
                  {project.links.video && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
