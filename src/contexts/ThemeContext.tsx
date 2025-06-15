
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Classic Black',
    primary: '0 0% 0%',
    secondary: '0 0% 96%',
    accent: '0 0% 96%',
    background: '0 0% 100%',
    foreground: '0 0% 10%',
    muted: '0 0% 96%',
    border: '0 0% 90%'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '221 83% 53%',
    secondary: '210 40% 98%',
    accent: '210 40% 96%',
    background: '0 0% 100%',
    foreground: '222 84% 5%',
    muted: '210 40% 96%',
    border: '214 32% 91%'
  },
  {
    id: 'green',
    name: 'Forest Green',
    primary: '142 76% 36%',
    secondary: '138 76% 97%',
    accent: '138 76% 94%',
    background: '0 0% 100%',
    foreground: '140 100% 5%',
    muted: '138 76% 94%',
    border: '139 65% 87%'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '262 83% 58%',
    secondary: '270 40% 98%',
    accent: '270 40% 96%',
    background: '0 0% 100%',
    foreground: '262 100% 5%',
    muted: '270 40% 96%',
    border: '270 32% 91%'
  },
  {
    id: 'red',
    name: 'Crimson Red',
    primary: '0 84% 60%',
    secondary: '0 40% 98%',
    accent: '0 40% 96%',
    background: '0 0% 100%',
    foreground: '0 100% 5%',
    muted: '0 40% 96%',
    border: '0 32% 91%'
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '25 95% 53%',
    secondary: '25 40% 98%',
    accent: '25 40% 96%',
    background: '0 0% 100%',
    foreground: '25 100% 5%',
    muted: '25 40% 96%',
    border: '25 32% 91%'
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('selected-theme');
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    console.log('Applying theme:', currentTheme.name);
    
    // Apply all theme colors to CSS custom properties
    root.style.setProperty('--primary', currentTheme.primary);
    root.style.setProperty('--primary-foreground', currentTheme.background);
    root.style.setProperty('--secondary', currentTheme.secondary);
    root.style.setProperty('--secondary-foreground', currentTheme.foreground);
    root.style.setProperty('--accent', currentTheme.accent);
    root.style.setProperty('--accent-foreground', currentTheme.foreground);
    root.style.setProperty('--background', currentTheme.background);
    root.style.setProperty('--foreground', currentTheme.foreground);
    root.style.setProperty('--muted', currentTheme.muted);
    root.style.setProperty('--muted-foreground', currentTheme.foreground);
    root.style.setProperty('--border', currentTheme.border);
    root.style.setProperty('--input', currentTheme.border);
    root.style.setProperty('--ring', currentTheme.primary);
    
    // Also apply to card colors for consistency
    root.style.setProperty('--card', currentTheme.background);
    root.style.setProperty('--card-foreground', currentTheme.foreground);
    root.style.setProperty('--popover', currentTheme.background);
    root.style.setProperty('--popover-foreground', currentTheme.foreground);
    
    console.log('Theme applied successfully');
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      console.log('Setting theme to:', theme.name);
      setCurrentTheme(theme);
      localStorage.setItem('selected-theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
