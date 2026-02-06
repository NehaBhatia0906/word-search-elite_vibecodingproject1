import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';

interface VictoryOverlayProps {
  wordsFound: number;
  onPlayAgain: () => void;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

export function VictoryOverlay({ wordsFound, onPlayAgain }: VictoryOverlayProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    // Soft pastel colors for confetti
    const colors = [
      'hsl(210, 60%, 80%)',  // pastel blue
      'hsl(145, 45%, 75%)',  // pastel green
      'hsl(340, 50%, 85%)',  // pastel pink
      'hsl(260, 40%, 82%)',  // pastel lavender
      'hsl(35, 40%, 80%)',   // pastel sand
      'hsl(25, 45%, 75%)',   // pastel peach
    ];

    const particles: Confetti[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
      });
    }
    setConfetti(particles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 rounded-full confetti-particle"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            width: `${c.size}px`,
            height: `${c.size}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      {/* Victory Card */}
      <div className="relative z-10 p-8 sm:p-10 rounded-3xl glass-strong shadow-soft-lg text-center max-w-md mx-4 animate-scale-in">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-pastel-sand to-secondary/50 flex items-center justify-center animate-float-gentle">
            <Trophy className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-3">
            Congratulations!
          </h2>
          <p className="text-muted-foreground">
            You found all the words
          </p>
        </div>

        <div className="mb-8 py-6 px-4 rounded-2xl bg-pastel-green/20">
          <div className="text-5xl font-display font-semibold text-foreground">
            {wordsFound}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            words discovered
          </div>
        </div>

        <Button
          onClick={onPlayAgain}
          className="w-full h-12 font-medium text-base bg-primary hover:bg-primary/90 rounded-xl"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </div>
    </div>
  );
}
