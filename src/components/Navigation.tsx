
import { useState } from 'react';
import { Menu, X, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminPanel from './AdminPanel';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation = ({
  activeSection,
  setActiveSection
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const navItems = [{
    id: 'home',
    label: 'Home',
    icon: Home
  }, {
    id: 'about',
    label: 'About Me'
  }, {
    id: 'education',
    label: 'Education'
  }, {
    id: 'projects',
    label: 'Projects'
  }, {
    id: 'courses',
    label: 'Courses'
  }, {
    id: 'research',
    label: 'Research'
  }, {
    id: 'openings',
    label: 'Openings'
  }, {
    id: 'gallery',
    label: 'Gallery'
  }, {
    id: 'contact',
    label: 'Contact'
  }, {
    id: 'blog',
    label: 'Blog'
  }];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GJ</span>
              </div>
              <span className="font-light text-xl text-foreground">Guruprakash J [GJ]</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Button 
                  key={item.id} 
                  variant={activeSection === item.id ? "default" : "ghost"} 
                  onClick={() => setActiveSection(item.id)} 
                  className={`font-light ${
                    activeSection === item.id 
                      ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdminPanel(true)} 
                className="ml-4 flex items-center space-x-1 border-border text-foreground hover:text-primary hover:border-primary"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdminPanel(true)}
                className="border-border text-foreground hover:text-primary hover:border-primary"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary hover:bg-accent"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navItems.map(item => (
                  <Button 
                    key={item.id} 
                    variant={activeSection === item.id ? "default" : "ghost"} 
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMenuOpen(false);
                    }} 
                    className={`justify-start font-light ${
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                        : "text-foreground hover:text-primary hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </>
  );
};

export default Navigation;
