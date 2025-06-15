import { supabase } from '@/integrations/supabase/client';
import { PortalData } from '@/types/portalData';

export class SupabasePortalStorageService {
  private static instance: SupabasePortalStorageService;
  private cache: PortalData | null = null;

  private constructor() {}

  static getInstance(): SupabasePortalStorageService {
    if (!this.instance) {
      this.instance = new SupabasePortalStorageService();
    }
    return this.instance;
  }

  async loadData(): Promise<PortalData> {
    try {
      // Load all portal data sections
      const { data, error } = await supabase
        .from('portal_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize default structure
      let portalData: PortalData = {
        about: {
          name: '',
          title: '',
          bio: '',
          expertise: [],
          contact: {
            email: '',
            phone: '',
            office: '',
            officeHours: ''
          },
          socialLinks: {}
        },
        education: [],
        certifications: [],
        projects: [],
        courses: [],
        research: [],
        openings: [],
        gallery: [],
        blogs: []
      };

      // Merge data from database
      data?.forEach(item => {
        if (item.content) {
          portalData[item.data_type as keyof PortalData] = item.content as any;
        }
      });

      this.cache = portalData;
      return portalData;
    } catch (error) {
      console.error('Error loading portal data:', error);
      throw error;
    }
  }

  async create<T extends { id: string }>(section: keyof PortalData, item: Omit<T, 'id'>): Promise<T> {
    try {
      const newItem = { ...item, id: crypto.randomUUID() } as T;
      
      // Get current data for this section
      const currentData = await this.getSectionData(section);
      const updatedData = Array.isArray(currentData) ? [...currentData, newItem] : [newItem];
      
      await this.saveSectionData(section, updatedData);
      this.clearCache();
      
      return newItem;
    } catch (error) {
      console.error(`Error creating ${section} item:`, error);
      throw error;
    }
  }

  async update<T extends { id: string }>(section: keyof PortalData, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const currentData = await this.getSectionData(section);
      
      if (Array.isArray(currentData)) {
        const itemIndex = currentData.findIndex((item: any) => item.id === id);
        if (itemIndex === -1) return null;
        
        const updatedItem = { ...currentData[itemIndex], ...updates };
        const updatedData = [...currentData];
        updatedData[itemIndex] = updatedItem;
        
        await this.saveSectionData(section, updatedData);
        this.clearCache();
        
        return updatedItem;
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating ${section} item:`, error);
      throw error;
    }
  }

  async delete(section: keyof PortalData, id: string): Promise<boolean> {
    try {
      const currentData = await this.getSectionData(section);
      
      if (Array.isArray(currentData)) {
        const filteredData = currentData.filter((item: any) => item.id !== id);
        await this.saveSectionData(section, filteredData);
        this.clearCache();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting ${section} item:`, error);
      throw error;
    }
  }

  async updateAbout(updates: Partial<PortalData['about']>): Promise<PortalData['about']> {
    try {
      const currentAbout = await this.getSectionData('about') as PortalData['about'];
      const updatedAbout = { ...currentAbout, ...updates };
      
      await this.saveSectionData('about', updatedAbout);
      this.clearCache();
      
      return updatedAbout;
    } catch (error) {
      console.error('Error updating about section:', error);
      throw error;
    }
  }

  exportData(): string {
    if (!this.cache) {
      throw new Error('No data to export. Load data first.');
    }
    return JSON.stringify(this.cache, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonString) as PortalData;
      
      // Save each section
      for (const [section, data] of Object.entries(importedData)) {
        await this.saveSectionData(section as keyof PortalData, data);
      }
      
      this.clearCache();
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  async resetData(): Promise<void> {
    try {
      // Delete all existing portal data
      const { error } = await supabase
        .from('portal_data')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      // Load comprehensive demo data
      const demoData = this.getDemoData();
      
      // Save each section with demo data
      for (const [section, data] of Object.entries(demoData)) {
        await this.saveSectionData(section as keyof PortalData, data);
      }
      
      this.clearCache();
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }

  private getDemoData(): PortalData {
    return {
      about: {
        name: "Dr. Sarah Mitchell",
        title: "Professor of Computer Science & AI Research",
        bio: "Dr. Sarah Mitchell is a distinguished Professor of Computer Science with over 15 years of experience in artificial intelligence, machine learning, and educational technology. She has published over 80 peer-reviewed papers and has been instrumental in developing innovative AI solutions for healthcare and education. Her research focuses on explainable AI, deep learning applications, and human-computer interaction. She is passionate about mentoring students and advancing the field of AI through both theoretical research and practical applications.",
        expertise: [
          "Artificial Intelligence",
          "Machine Learning",
          "Deep Learning",
          "Natural Language Processing",
          "Computer Vision",
          "Educational Technology",
          "Human-Computer Interaction",
          "Explainable AI",
          "Data Science",
          "Neural Networks"
        ],
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=400&h=400&fit=crop&crop=face",
        contact: {
          email: "sarah.mitchell@university.edu",
          phone: "+1 (555) 123-4567",
          office: "Room 425, Computer Science Building",
          officeHours: "Mondays & Wednesdays: 2:00 PM - 4:00 PM, Fridays: 10:00 AM - 12:00 PM"
        },
        socialLinks: {
          linkedin: "https://linkedin.com/in/drsarahmitchell",
          researchGate: "https://researchgate.net/profile/Sarah_Mitchell",
          googleScholar: "https://scholar.google.com/citations?user=abc123def",
          orcid: "https://orcid.org/0000-0000-0000-0001"
        }
      },
      education: [
        {
          id: "edu-1",
          degree: "Ph.D. in Computer Science",
          institution: "Stanford University",
          year: "2008",
          location: "Stanford, CA",
          description: "Dissertation: \"Explainable AI Systems for Healthcare Decision Support\". Research focused on developing interpretable machine learning models for medical diagnosis with emphasis on transparency and trust in AI systems.",
          advisor: "Dr. Andrew Ng",
          achievements: [
            "Summa Cum Laude",
            "Outstanding Dissertation Award",
            "Stanford AI Lab Fellowship",
            "Best Paper Award at ICML 2008"
          ],
          universityLogo: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=100&h=100&fit=crop"
        },
        {
          id: "edu-2",
          degree: "M.S. in Computer Science",
          institution: "MIT",
          year: "2004",
          location: "Cambridge, MA",
          description: "Specialized in artificial intelligence and machine learning. Thesis on \"Neural Network Optimization for Real-time Applications\".",
          advisor: "Dr. Marvin Minsky",
          achievements: [
            "Magna Cum Laude",
            "MIT AI Lab Research Assistant",
            "Outstanding Teaching Assistant Award"
          ],
          universityLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop"
        },
        {
          id: "edu-3",
          degree: "B.S. in Computer Science",
          institution: "UC Berkeley",
          year: "2002",
          location: "Berkeley, CA",
          description: "Graduated with honors. Senior project on computer vision applications for autonomous vehicles.",
          achievements: [
            "Phi Beta Kappa",
            "Dean's List (8 semesters)",
            "Outstanding Senior Project Award"
          ],
          universityLogo: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=100&h=100&fit=crop"
        }
      ],
      certifications: [
        {
          id: "cert-1",
          title: "Certified Data Scientist Professional",
          organization: "Data Science Council of America (DASCA)",
          year: "2023"
        },
        {
          id: "cert-2",
          title: "Google Cloud Professional ML Engineer",
          organization: "Google Cloud",
          year: "2022"
        },
        {
          id: "cert-3",
          title: "AWS Certified Machine Learning - Specialty",
          organization: "Amazon Web Services",
          year: "2021"
        },
        {
          id: "cert-4",
          title: "TensorFlow Developer Certificate",
          organization: "TensorFlow",
          year: "2020"
        }
      ],
      projects: [
        {
          id: "proj-1",
          title: "MedAI: Intelligent Medical Diagnosis System",
          description: "Developed an AI-powered medical diagnosis system that assists doctors in identifying diseases from medical imaging. The system uses deep learning models trained on over 1 million medical images and provides explanations for its predictions to build trust with medical professionals.",
          technologies: ["Python", "TensorFlow", "PyTorch", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
          duration: "2022 - 2024",
          collaborators: 8,
          status: "Completed",
          achievements: [
            "95% accuracy in disease detection",
            "Deployed in 5 major hospitals",
            "Published in Nature Medicine",
            "Winner of Healthcare Innovation Award 2023"
          ],
          links: {
            demo: "https://medai-demo.university.edu",
            github: "https://github.com/sarahmitchell/medai",
            paper: "https://nature.com/articles/medai-2023",
            video: "https://youtube.com/watch?v=medai-demo"
          }
        },
        {
          id: "proj-2",
          title: "EduBot: Personalized Learning Assistant",
          description: "Created an intelligent tutoring system that adapts to individual student learning patterns. The system uses natural language processing to understand student questions and provides personalized explanations and learning materials.",
          technologies: ["Python", "NLP", "Transformers", "Vue.js", "FastAPI", "MongoDB", "Redis"],
          duration: "2021 - 2023",
          collaborators: 6,
          status: "Completed",
          achievements: [
            "Improved student performance by 40%",
            "Used by 10,000+ students",
            "Best Paper at EDM Conference 2022",
            "Featured in EdTech Magazine"
          ],
          links: {
            demo: "https://edubot.university.edu",
            paper: "https://educationaldatamining.org/edubot-2022",
            video: "https://youtube.com/watch?v=edubot-demo"
          }
        },
        {
          id: "proj-3",
          title: "Climate Prediction AI",
          description: "Developing advanced machine learning models to predict climate patterns and extreme weather events. This ongoing project collaborates with meteorologists to improve weather forecasting accuracy and help communities prepare for climate change impacts.",
          technologies: ["Python", "TensorFlow", "XGBoost", "Apache Spark", "Kubernetes", "GCP"],
          duration: "2023 - Present",
          collaborators: 12,
          status: "In Progress",
          achievements: [
            "20% improvement in prediction accuracy",
            "Partnership with National Weather Service",
            "NSF Grant of $2.5M awarded"
          ],
          links: {
            github: "https://github.com/climate-ai/prediction-models"
          }
        }
      ],
      courses: [
        {
          id: "course-1",
          title: "Introduction to Artificial Intelligence",
          code: "CS 470",
          level: "Undergraduate",
          credits: 3,
          semester: "Fall 2024",
          enrollment: 120,
          maxEnrollment: 150,
          description: "This course provides a comprehensive introduction to artificial intelligence, covering fundamental concepts, algorithms, and applications. Students will learn about search algorithms, knowledge representation, machine learning basics, and AI ethics.",
          learningOutcomes: [
            "Understand fundamental AI concepts and terminology",
            "Implement basic AI algorithms",
            "Analyze real-world AI applications",
            "Evaluate ethical implications of AI systems",
            "Design simple AI solutions"
          ],
          schedule: {
            days: "MWF",
            time: "10:00 AM - 11:00 AM",
            location: "CS Building, Room 201"
          },
          online: false,
          industry: "Technology",
          textbooks: [
            {
              title: "Artificial Intelligence: A Modern Approach",
              author: "Stuart Russell & Peter Norvig",
              edition: "4th Edition",
              isbn: "978-0134610993"
            }
          ],
          softwareTools: ["Python", "Jupyter Notebooks", "scikit-learn", "NLTK"],
          courseLinks: [
            {
              name: "Course Syllabus",
              url: "https://courses.university.edu/cs470/syllabus"
            },
            {
              name: "Lecture Notes",
              url: "https://courses.university.edu/cs470/notes"
            }
          ],
          lessons: [
            {
              week: 1,
              title: "Introduction to AI",
              topics: ["What is AI?", "History of AI", "AI Applications"],
              resources: [
                {
                  name: "Lecture Slides",
                  url: "https://courses.university.edu/cs470/week1/slides",
                  type: "document"
                },
                {
                  name: "AI Introduction Video",
                  url: "https://youtube.com/watch?v=ai-intro",
                  type: "video"
                }
              ]
            },
            {
              week: 2,
              title: "Search Algorithms",
              topics: ["Uninformed Search", "Informed Search", "Heuristics"],
              resources: [
                {
                  name: "Search Algorithms Tutorial",
                  url: "https://courses.university.edu/cs470/week2/tutorial",
                  type: "learning"
                }
              ]
            }
          ]
        },
        {
          id: "course-2",
          title: "Machine Learning",
          code: "CS 571",
          level: "Graduate",
          credits: 4,
          semester: "Spring 2024",
          enrollment: 45,
          maxEnrollment: 50,
          description: "Advanced course covering machine learning algorithms, deep learning, and modern AI techniques. Students will implement ML algorithms from scratch and work on real-world projects.",
          learningOutcomes: [
            "Master supervised and unsupervised learning algorithms",
            "Implement neural networks and deep learning models",
            "Apply ML techniques to real-world problems",
            "Understand theoretical foundations of ML"
          ],
          schedule: {
            days: "TTh",
            time: "2:00 PM - 3:30 PM",
            location: "CS Building, Room 305"
          },
          online: true,
          lessons: [
            {
              week: 1,
              title: "ML Fundamentals",
              topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
              resources: []
            }
          ]
        }
      ],
      research: [
        {
          id: "research-1",
          title: "Explainable AI for Healthcare: Building Trust in Medical AI Systems",
          authors: ["Sarah Mitchell", "John Davis", "Emily Chen", "Michael Rodriguez"],
          journal: "Nature Medicine",
          year: "2024",
          doi: "10.1038/s41591-024-1234-5",
          abstract: "This study presents a novel framework for developing explainable AI systems in healthcare applications. We demonstrate how transparency in AI decision-making can improve physician trust and patient outcomes. Our approach combines advanced deep learning techniques with interpretability methods to create AI systems that not only achieve high accuracy but also provide clear explanations for their decisions.",
          keywords: ["Explainable AI", "Healthcare", "Medical Diagnosis", "Machine Learning", "Trust", "Interpretability"],
          citations: 156
        },
        {
          id: "research-2",
          title: "Personalized Learning Through Adaptive AI Tutoring Systems",
          authors: ["Sarah Mitchell", "Alex Thompson", "Lisa Park"],
          journal: "Computers & Education",
          year: "2023",
          doi: "10.1016/j.compedu.2023.104567",
          abstract: "We present a comprehensive study on the effectiveness of AI-powered personalized tutoring systems. Our research shows that adaptive learning algorithms can significantly improve student engagement and learning outcomes compared to traditional teaching methods.",
          keywords: ["Educational Technology", "Personalized Learning", "AI Tutoring", "Adaptive Systems", "Student Performance"],
          citations: 89
        },
        {
          id: "research-3",
          title: "Climate Pattern Recognition Using Deep Learning and Satellite Data",
          authors: ["Sarah Mitchell", "David Wilson", "Maria Garcia", "James Kim", "Anna Petrov"],
          journal: "Journal of Climate",
          year: "2023",
          doi: "10.1175/JCLI-D-23-0123.1",
          abstract: "This paper introduces a novel deep learning approach for analyzing climate patterns using multi-decade satellite imagery. Our model demonstrates superior performance in predicting extreme weather events and understanding long-term climate trends.",
          keywords: ["Climate Science", "Deep Learning", "Satellite Imagery", "Weather Prediction", "CNN"],
          citations: 72
        }
      ],
      openings: [
        {
          id: "opening-1",
          title: "Graduate Research Assistant - AI for Healthcare",
          description: "We are seeking a motivated graduate student to join our research team working on explainable AI systems for medical diagnosis. The successful candidate will work on developing interpretable machine learning models that can assist healthcare professionals in making informed decisions.",
          requirements: [
            "Currently enrolled in CS or related PhD program",
            "Strong background in machine learning and deep learning",
            "Experience with Python, TensorFlow/PyTorch",
            "Interest in healthcare applications",
            "Excellent communication skills",
            "Prior research experience preferred"
          ],
          duration: "2 years",
          type: "Research",
          level: "PhD",
          status: "Open",
          applicationDeadline: "2024-03-15"
        },
        {
          id: "opening-2",
          title: "Undergraduate Research - Educational AI",
          description: "Opportunity for undergraduate students to participate in cutting-edge research on AI-powered educational tools. Students will contribute to the development of personalized learning systems and gain hands-on experience with modern AI techniques.",
          requirements: [
            "Junior or Senior standing in CS, Math, or related field",
            "GPA of 3.5 or higher",
            "Completion of CS 470 (Introduction to AI)",
            "Programming experience in Python",
            "Strong analytical and problem-solving skills"
          ],
          duration: "1 semester (renewable)",
          type: "Independent Study",
          level: "Undergraduate",
          status: "Open",
          applicationDeadline: "2024-02-01"
        },
        {
          id: "opening-3",
          title: "Master's Thesis - Climate Prediction Models",
          description: "Master's students interested in applying machine learning to climate science are invited to work on advanced prediction models. This project involves collaboration with meteorologists and access to large-scale climate datasets.",
          requirements: [
            "Enrolled in MS program in CS, Statistics, or related field",
            "Background in machine learning and data analysis",
            "Interest in environmental science applications",
            "Experience with large datasets preferred"
          ],
          duration: "1-2 years",
          type: "Thesis",
          level: "Graduate",
          status: "Filled",
          applicationDeadline: "2023-12-01"
        }
      ],
      blogs: [
        {
          id: "blog-1",
          title: "The Future of Explainable AI in Healthcare",
          excerpt: "As AI systems become more prevalent in healthcare, the need for transparency and interpretability becomes crucial. This post explores the latest developments in explainable AI and their potential impact on medical practice.",
          content: "# The Future of Explainable AI in Healthcare\n\nArtificial Intelligence is revolutionizing healthcare, but with great power comes great responsibility. As we integrate AI systems into medical practice, we must ensure that these systems are not just accurate, but also transparent and trustworthy.\n\n## Why Explainability Matters\n\nIn healthcare, decisions can be a matter of life and death. When an AI system recommends a treatment or diagnosis, medical professionals need to understand the reasoning behind that recommendation. This is where explainable AI (XAI) comes into play.\n\n## Current Challenges\n\n1. **Black Box Problem**: Many advanced AI models, particularly deep neural networks, operate as \"black boxes\" where the decision-making process is opaque.\n\n2. **Trust and Adoption**: Healthcare professionals are naturally cautious about adopting new technologies, especially when they can't understand how decisions are made.\n\n3. **Regulatory Requirements**: Medical AI systems must meet strict regulatory standards that often require explainability.\n\n## Recent Advances\n\nOur research team has been working on several approaches to make AI more explainable:\n\n- **Attention Mechanisms**: Highlighting which parts of medical images the AI focuses on when making decisions\n- **Feature Importance**: Showing which patient characteristics most influence the AI's recommendations\n- **Counterfactual Explanations**: Explaining what would need to change for the AI to make a different decision\n\n## The Road Ahead\n\nThe future of healthcare AI lies in finding the right balance between accuracy and explainability. We envision AI systems that can:\n\n- Provide clear, understandable explanations for their decisions\n- Adapt their explanations to different audiences (doctors, patients, researchers)\n- Learn from human feedback to improve both accuracy and interpretability\n\n## Conclusion\n\nExplainable AI is not just a technical challenge—it's a necessity for the responsible deployment of AI in healthcare. As we continue to push the boundaries of what's possible with AI, we must never lose sight of the human element that makes healthcare so important.\n\n---\n\n*What are your thoughts on explainable AI in healthcare? Share your perspectives in the comments below.*",
          keywords: ["Explainable AI", "Healthcare", "Medical AI", "Transparency", "Trust"],
          author: "Dr. Sarah Mitchell",
          publishDate: "2024-01-15",
          lastModified: "2024-01-15",
          status: "Published",
          seoTitle: "Future of Explainable AI in Healthcare - Building Trust in Medical AI",
          seoDescription: "Explore the importance of explainable AI in healthcare and how transparency in AI decision-making can improve patient outcomes and physician trust.",
          featuredImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
          readingTime: 8
        },
        {
          id: "blog-2",
          title: "Machine Learning in Education: Transforming How We Learn",
          excerpt: "Discover how machine learning is personalizing education and creating adaptive learning experiences that cater to individual student needs and learning styles.",
          content: "# Machine Learning in Education: Transforming How We Learn\n\nEducation is undergoing a technological revolution, and machine learning is at the forefront of this transformation. From personalized learning platforms to intelligent tutoring systems, AI is changing how we approach teaching and learning.\n\n## The Promise of Personalized Learning\n\nEvery student learns differently. Some are visual learners, others prefer hands-on experiences, and many fall somewhere in between. Traditional one-size-fits-all educational approaches often fail to address these individual differences.\n\nMachine learning offers a solution by enabling truly personalized learning experiences:\n\n### Adaptive Learning Paths\n- AI can analyze student performance in real-time\n- Learning paths adjust based on strengths and weaknesses\n- Content difficulty scales appropriately for each learner\n\n### Intelligent Content Recommendation\n- Systems learn from student interactions\n- Relevant materials are suggested based on learning patterns\n- Knowledge gaps are identified and addressed proactively\n\n## Real-World Applications\n\nOur research has led to several practical applications:\n\n### EduBot: Our AI Tutoring System\n\nWe developed EduBot, an intelligent tutoring system that has shown remarkable results:\n- 40% improvement in student performance\n- Increased engagement and motivation\n- 24/7 availability for student support\n\n### Predictive Analytics for Student Success\n\nBy analyzing patterns in student data, we can:\n- Identify at-risk students early\n- Provide timely interventions\n- Improve graduation rates\n\n## Challenges and Considerations\n\n### Privacy and Ethics\n- Student data must be protected\n- Algorithmic bias needs to be addressed\n- Transparency in AI decision-making is crucial\n\n### Teacher Integration\n- AI should augment, not replace, human teachers\n- Professional development is essential\n- Maintaining the human connection in education\n\n## Looking Forward\n\nThe future of education will likely see:\n- More sophisticated AI tutors\n- Virtual and augmented reality integration\n- Continuous assessment and feedback\n- Global access to quality education\n\n## Conclusion\n\nMachine learning has the potential to democratize education and make high-quality, personalized learning available to everyone. However, we must approach this transformation thoughtfully, ensuring that technology serves to enhance rather than replace the fundamental human aspects of education.\n\n---\n\n*How do you see AI changing education? Share your experiences and thoughts!*",
          keywords: ["Machine Learning", "Education", "Personalized Learning", "AI Tutoring", "EdTech"],
          author: "Dr. Sarah Mitchell",
          publishDate: "2023-12-10",
          lastModified: "2023-12-10",
          status: "Published",
          seoTitle: "Machine Learning in Education - Personalizing Learning with AI",
          seoDescription: "Learn how machine learning is transforming education through personalized learning experiences and intelligent tutoring systems.",
          featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
          readingTime: 6
        },
        {
          id: "blog-3",
          title: "Climate Change and AI: Using Technology to Understand Our Planet",
          excerpt: "Explore how artificial intelligence and machine learning are helping scientists better understand climate patterns and predict environmental changes.",
          content: "# Climate Change and AI: Using Technology to Understand Our Planet\n\nClimate change represents one of the most pressing challenges of our time. As we work to understand and address this global issue, artificial intelligence is emerging as a powerful tool in our arsenal.\n\n## The Data Challenge\n\nClimate science generates enormous amounts of data:\n- Satellite imagery spanning decades\n- Weather station measurements worldwide\n- Ocean temperature and current data\n- Atmospheric composition readings\n\nTraditional analysis methods struggle with this scale and complexity. This is where AI excels.\n\n## AI Applications in Climate Science\n\n### Pattern Recognition\nMachine learning models can identify subtle patterns in climate data that humans might miss:\n- Long-term temperature trends\n- Unusual weather pattern formations\n- Early warning signs of extreme events\n\n### Predictive Modeling\nOur research focuses on improving weather and climate predictions:\n- Enhanced hurricane tracking\n- Better drought forecasting\n- More accurate seasonal predictions\n\n### Data Integration\nAI helps combine diverse data sources:\n- Satellite imagery with ground measurements\n- Historical records with real-time data\n- Multiple climate models for ensemble predictions\n\n## Our Research Project\n\nOur team is developing advanced machine learning models for climate prediction:\n\n### Key Achievements\n- 20% improvement in prediction accuracy\n- Partnership with the National Weather Service\n- $2.5M NSF grant for continued research\n\n### Technical Approach\n- Deep neural networks for pattern recognition\n- Ensemble methods for robust predictions\n- Transfer learning from related domains\n\n## Real-World Impact\n\n### Early Warning Systems\nBetter predictions enable:\n- Improved disaster preparedness\n- More effective evacuation planning\n- Reduced economic losses from extreme weather\n\n### Agricultural Planning\nFarmers can make better decisions with:\n- Seasonal weather forecasts\n- Drought risk assessments\n- Optimal planting time predictions\n\n### Policy Support\nPolicymakers benefit from:\n- Long-term climate projections\n- Risk assessments for infrastructure\n- Economic impact analyses\n\n## Challenges and Limitations\n\n### Data Quality\n- Incomplete historical records\n- Sensor calibration issues\n- Missing data from remote regions\n\n### Model Uncertainty\n- Climate systems are inherently chaotic\n- Small changes can have large effects\n- Multiple models may give different results\n\n### Computational Requirements\n- Climate models require massive computing power\n- Real-time processing is challenging\n- Energy consumption of AI systems\n\n## The Future\n\nAs AI technology continues to advance, we expect to see:\n- More accurate long-term climate projections\n- Better understanding of tipping points\n- Improved attribution of extreme events to climate change\n- Enhanced decision support tools\n\n## Conclusion\n\nAI alone won't solve climate change, but it's proving to be an invaluable tool for understanding our planet's complex climate system. By combining advanced AI techniques with domain expertise from climate scientists, we can develop better tools for prediction, adaptation, and mitigation.\n\nThe race against climate change requires all available tools, and AI is helping us understand our planet like never before.\n\n---\n\n*What role do you think AI should play in addressing climate change? Join the discussion!*",
          keywords: ["Climate Change", "AI", "Machine Learning", "Weather Prediction", "Environmental Science"],
          author: "Dr. Sarah Mitchell",
          publishDate: "2023-11-22",
          lastModified: "2023-11-22",
          status: "Published",
          seoTitle: "AI and Climate Change - Using Technology to Understand Our Planet",
          seoDescription: "Discover how artificial intelligence is helping scientists understand climate patterns and improve weather predictions.",
          featuredImage: "https://images.unsplash.com/photo-1569163139394-de44eabf4255?w=800&h=400&fit=crop",
          readingTime: 7
        }
      ],
      gallery: [
        {
          id: "gallery-1",
          title: "AI Research Lab Opening Ceremony",
          description: "Grand opening of our new state-of-the-art AI research laboratory, featuring cutting-edge computing infrastructure and collaborative spaces for interdisciplinary research.",
          mediaType: "photo",
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
          uploadType: "url",
          date: "2024-01-15",
          eventType: "Conference",
          location: {
            name: "Computer Science Building, University Campus",
            latitude: 40.7128,
            longitude: -74.0060
          },
          tags: ["research", "lab", "opening", "AI", "infrastructure"]
        },
        {
          id: "gallery-2",
          title: "International AI Conference Keynote",
          description: "Delivering the opening keynote at the International Conference on Artificial Intelligence, discussing the future of explainable AI in healthcare applications.",
          mediaType: "photo",
          photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
          uploadType: "url",
          date: "2023-12-08",
          eventType: "Conference",
          location: {
            name: "Convention Center, San Francisco, CA",
            latitude: 37.7749,
            longitude: -122.4194
          },
          tags: ["keynote", "conference", "AI", "speaking", "healthcare"]
        },
        {
          id: "gallery-3",
          title: "Graduate Student Research Presentation",
          description: "PhD students presenting their latest research findings on machine learning applications in climate science at our weekly research seminar.",
          mediaType: "photo",
          photo: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
          uploadType: "url",
          date: "2023-11-20",
          eventType: "Seminar",
          location: {
            name: "Research Seminar Room, CS Building",
            latitude: 40.7128,
            longitude: -74.0060
          },
          tags: ["students", "research", "presentation", "climate", "seminar"]
        },
        {
          id: "gallery-4",
          title: "Industry Partnership Workshop",
          description: "Collaborative workshop with healthcare industry partners to discuss real-world applications of our medical AI research and potential deployment strategies.",
          mediaType: "photo",
          photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
          uploadType: "url",
          date: "2023-10-15",
          eventType: "Workshop",
          location: {
            name: "Innovation Hub, Medical Center",
            latitude: 40.7300,
            longitude: -73.9950
          },
          tags: ["industry", "healthcare", "collaboration", "workshop", "medical AI"]
        },
        {
          id: "gallery-5",
          title: "AI Ethics Panel Discussion",
          description: "Participating in a panel discussion on the ethical implications of AI in society, focusing on bias, fairness, and transparency in algorithmic decision-making.",
          mediaType: "video",
          video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          uploadType: "url",
          date: "2023-09-28",
          eventType: "Other",
          location: {
            name: "University Auditorium",
            latitude: 40.7128,
            longitude: -74.0060
          },
          tags: ["ethics", "panel", "AI", "discussion", "fairness"]
        },
        {
          id: "gallery-6",
          title: "Student Team Hackathon Victory",
          description: "Celebrating with our undergraduate research team after winning first place in the National AI for Good Hackathon with their educational AI project.",
          mediaType: "photo",
          photo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
          uploadType: "url",
          date: "2023-08-12",
          eventType: "Other",
          location: {
            name: "Tech Innovation Center, Boston, MA",
            latitude: 42.3601,
            longitude: -71.0589
          },
          tags: ["hackathon", "students", "competition", "victory", "education"]
        }
      ]
    };
  }

  private async getSectionData(section: keyof PortalData): Promise<any> {
    const { data, error } = await supabase
      .from('portal_data')
      .select('content')
      .eq('data_type', section)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data?.content || (section === 'about' ? {
      name: '',
      title: '',
      bio: '',
      expertise: [],
      contact: { email: '', phone: '', office: '', officeHours: '' },
      socialLinks: {}
    } : []);
  }

  private async saveSectionData(section: keyof PortalData, data: any): Promise<void> {
    const { error } = await supabase
      .from('portal_data')
      .upsert({
        data_type: section,
        content: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'data_type'
      });

    if (error) throw error;
  }

  clearCache(): void {
    this.cache = null;
  }
}
