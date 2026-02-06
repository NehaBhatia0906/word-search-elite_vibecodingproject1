import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DynamicBackgroundProps {
  imageUrl: string | null;
  photographer?: string;
  photographerUrl?: string;
  children: React.ReactNode;
}

export function DynamicBackground({ 
  imageUrl, 
  photographer,
  photographerUrl,
  children 
}: DynamicBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      setIsLoaded(false);
      const img = new Image();
      img.onload = () => {
        setCurrentImage(imageUrl);
        setIsLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Layer */}
      <div 
        className={cn(
          "fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          backgroundImage: currentImage ? `url(${currentImage})` : 'none',
        }}
      />
      
      {/* Default gradient background when no image */}
      <div 
        className={cn(
          "fixed inset-0 transition-opacity duration-1000",
          currentImage && isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          background: 'linear-gradient(135deg, hsl(40 30% 96%) 0%, hsl(200 20% 92%) 50%, hsl(260 15% 94%) 100%)'
        }}
      />
      
      {/* Overlay for readability */}
      <div 
        className={cn(
          "fixed inset-0 transition-opacity duration-700",
          currentImage && isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.85) 0%, hsla(0, 0%, 100%, 0.75) 50%, hsla(0, 0%, 100%, 0.85) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Photo credit */}
      {photographer && currentImage && isLoaded && (
        <div className="fixed bottom-4 right-4 z-20">
          <div className="glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
            Photo by{' '}
            {photographerUrl ? (
              <a 
                href={photographerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                {photographer}
              </a>
            ) : (
              photographer
            )}
            {' '}on Unsplash
          </div>
        </div>
      )}
    </div>
  );
}
