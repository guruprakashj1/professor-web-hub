
import { Palette, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  const getThemePreviewStyle = (theme: any) => ({
    background: `hsl(${theme.background})`,
    border: `1px solid hsl(${theme.border})`,
    color: `hsl(${theme.foreground})`
  });

  const getPrimaryColorStyle = (theme: any) => ({
    backgroundColor: `hsl(${theme.primary})`
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Website Theme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="relative cursor-pointer group"
              onClick={() => setTheme(theme.id)}
            >
              <div
                className="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  ...getThemePreviewStyle(theme),
                  borderColor: currentTheme.id === theme.id ? `hsl(${theme.primary})` : `hsl(${theme.border})`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">{theme.name}</h3>
                  {currentTheme.id === theme.id && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={getPrimaryColorStyle(theme)}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={getPrimaryColorStyle(theme)}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${theme.secondary})` }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${theme.accent})` }}
                    />
                  </div>
                  
                  <div className="text-xs opacity-75">
                    Primary • Secondary • Accent
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Current Theme</h4>
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium">{currentTheme.name}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Theme changes are applied immediately and saved automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
