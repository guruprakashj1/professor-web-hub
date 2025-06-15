
import { useState } from 'react';
import { Palette, Check, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import FileUploadPreview from './FileUploadPreview';

const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [themeBanners, setThemeBanners] = useState<Record<string, string>>({});

  const getThemePreviewStyle = (theme: any) => ({
    background: `hsl(${theme.background})`,
    border: `1px solid hsl(${theme.border})`,
    color: `hsl(${theme.foreground})`
  });

  const getPrimaryColorStyle = (theme: any) => ({
    backgroundColor: `hsl(${theme.primary})`
  });

  const updateThemeBanner = (themeId: string, bannerUrl: string | undefined) => {
    setThemeBanners(prev => ({
      ...prev,
      [themeId]: bannerUrl || ''
    }));
    
    // Save to localStorage for persistence
    const savedBanners = JSON.parse(localStorage.getItem('theme_banners') || '{}');
    if (bannerUrl) {
      savedBanners[themeId] = bannerUrl;
    } else {
      delete savedBanners[themeId];
    }
    localStorage.setItem('theme_banners', JSON.stringify(savedBanners));
  };

  // Load saved banners on component mount
  useState(() => {
    const savedBanners = JSON.parse(localStorage.getItem('theme_banners') || '{}');
    setThemeBanners(savedBanners);
  });

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Theme Banner Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Set custom banner images for each theme. These will be displayed on the home page when the respective theme is active.
            </p>
            
            {themes.map((theme) => (
              <div key={theme.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={getPrimaryColorStyle(theme)}
                  />
                  <h4 className="font-medium text-sm">{theme.name} Banner</h4>
                </div>
                
                <FileUploadPreview
                  label={`Banner for ${theme.name}`}
                  value={themeBanners[theme.id]}
                  onChange={(value) => updateThemeBanner(theme.id, value)}
                  accept="image/*"
                  maxSize={5}
                  previewClassName="w-full h-32"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Banner Usage</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Banner images are displayed on the home page hero section</li>
              <li>• Each theme can have its own unique banner image</li>
              <li>• Recommended size: 1920x600 pixels for best results</li>
              <li>• Images are automatically resized and optimized</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSelector;
