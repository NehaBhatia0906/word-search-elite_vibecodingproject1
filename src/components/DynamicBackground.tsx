import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DynamicBackgroundProps {
  imageUrl: string | null;
  children: React.ReactNode;
}

export function DynamicBackground({ 
  imageUrl, 
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
      img.onerror = () => {
        console.error('Failed to load background image');
        setCurrentImage(null);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className={cn(
          "fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          backgroundImage: currentImage ? `url(${currentImage})` : 'none',
          filter: 'blur(25px)',
          transform: 'scale(1.1)', // prevent blur edge artifacts
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
      
      {/* 50% Dark Overlay for text legibility */}
      <div 
        className={cn(
          "fixed inset-0 transition-opacity duration-700",
          currentImage && isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: 'rgba(0, 0, 0, 0.50)'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
