
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Camera, Tag } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const GallerySection = () => {
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

  const gallery = data?.gallery || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-black mb-8 text-center">Gallery</h2>
        
        {gallery.length === 0 ? (
          <div className="text-center text-gray-700 py-16">
            <div className="text-xl mb-4 font-light">No photos available</div>
            <p className="font-light">Event photos and memories will be displayed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <Card key={item.id} className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-black bg-white overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/80 text-white text-xs rounded font-light">
                      {item.eventType}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-light text-black text-lg group-hover:text-gray-800 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm font-light line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span className="font-light">{item.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="font-light">{item.location.name}</span>
                    </div>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-black rounded text-xs font-light border border-gray-200 hover:bg-black hover:text-white transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 text-xs font-light">
                          +{item.tags.length - 3} more
                        </span>
                      )}
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

export default GallerySection;
