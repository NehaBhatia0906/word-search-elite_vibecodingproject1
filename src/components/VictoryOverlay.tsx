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
 }
 
 export function VictoryOverlay({ wordsFound, onPlayAgain }: VictoryOverlayProps) {
   const [confetti, setConfetti] = useState<Confetti[]>([]);
 
   useEffect(() => {
     const colors = [
       'hsl(180, 100%, 50%)', // cyan
       'hsl(320, 100%, 60%)', // pink
       'hsl(145, 100%, 50%)', // green
       'hsl(55, 100%, 55%)',  // yellow
       'hsl(270, 100%, 65%)', // purple
     ];
 
     const particles: Confetti[] = [];
     for (let i = 0; i < 50; i++) {
       particles.push({
         id: i,
         left: Math.random() * 100,
         delay: Math.random() * 0.5,
         duration: 2 + Math.random() * 2,
         color: colors[Math.floor(Math.random() * colors.length)],
       });
     }
     setConfetti(particles);
   }, []);
 
   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
       {/* Confetti */}
       {confetti.map((c) => (
         <div
           key={c.id}
           className="absolute top-0 w-3 h-3 rounded-full"
           style={{
             left: `${c.left}%`,
             backgroundColor: c.color,
             animation: `confetti ${c.duration}s ease-out ${c.delay}s forwards`,
             boxShadow: `0 0 10px ${c.color}`,
           }}
         />
       ))}
 
       {/* Victory Card */}
       <div className="relative z-10 p-8 rounded-2xl neon-border bg-card/80 backdrop-blur-sm text-center max-w-md mx-4">
         <div className="mb-6">
           <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-yellow to-neon-orange flex items-center justify-center animate-float">
             <Trophy className="w-10 h-10 text-background" />
           </div>
           <h2 className="font-display text-3xl sm:text-4xl text-primary text-glow-cyan mb-2">
             VICTORY!
           </h2>
           <p className="text-muted-foreground font-mono">
             You found all the words!
           </p>
         </div>
 
         <div className="mb-8 p-4 rounded-lg bg-muted/50">
           <div className="text-5xl font-display font-bold text-neon-green text-glow-cyan">
             {wordsFound}
           </div>
           <div className="text-sm text-muted-foreground font-mono mt-1">
             WORDS FOUND
           </div>
         </div>
 
         <Button
           onClick={onPlayAgain}
           className="w-full h-12 font-display text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
         >
           <RotateCcw className="w-5 h-5 mr-2" />
           PLAY AGAIN
         </Button>
       </div>
     </div>
   );
 }