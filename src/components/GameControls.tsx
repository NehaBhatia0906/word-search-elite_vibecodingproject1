 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Loader2, Sparkles, Zap } from 'lucide-react';
 import { Difficulty } from '@/lib/wordSearchGenerator';
 import { cn } from '@/lib/utils';
 
 interface GameControlsProps {
   onGenerate: (theme: string, difficulty: Difficulty, gameMode: 'classic' | 'mystery') => void;
   isLoading: boolean;
   disabled: boolean;
 }
 
 export function GameControls({ onGenerate, isLoading, disabled }: GameControlsProps) {
   const [theme, setTheme] = useState('');
   const [difficulty, setDifficulty] = useState<Difficulty>('easy');
   const [gameMode, setGameMode] = useState<'classic' | 'mystery'>('classic');
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (theme.trim()) {
       onGenerate(theme.trim(), difficulty, gameMode);
     }
   };
 
   const difficulties: { value: Difficulty; label: string; desc: string }[] = [
     { value: 'easy', label: 'EASY', desc: '10×10' },
     { value: 'medium', label: 'MEDIUM', desc: '15×15' },
     { value: 'hard', label: 'HARD', desc: '20×20' },
   ];
 
   const gameModes: { value: 'classic' | 'mystery'; label: string; icon: React.ReactNode }[] = [
     { value: 'classic', label: 'CLASSIC', icon: <Sparkles className="w-4 h-4" /> },
     { value: 'mystery', label: 'MYSTERY', icon: <Zap className="w-4 h-4" /> },
   ];
 
   return (
     <form onSubmit={handleSubmit} className="space-y-6">
       {/* Theme Input */}
       <div className="space-y-2">
         <label className="font-display text-sm text-primary text-glow-cyan block">
           ENTER THEME
         </label>
         <Input
           type="text"
           placeholder="e.g., Jurassic Period, Space Exploration..."
           value={theme}
           onChange={(e) => setTheme(e.target.value)}
           disabled={isLoading}
           className="bg-input border-border focus:border-primary focus:ring-primary/50 font-mono placeholder:text-muted-foreground/50"
         />
       </div>
 
       {/* Difficulty Selection */}
       <div className="space-y-2">
         <label className="font-display text-sm text-primary text-glow-cyan block">
           DIFFICULTY
         </label>
         <div className="grid grid-cols-3 gap-2">
           {difficulties.map((d) => (
             <button
               key={d.value}
               type="button"
               onClick={() => setDifficulty(d.value)}
               disabled={isLoading}
               className={cn(
                 'p-3 rounded-lg border transition-all duration-200 text-center',
                 difficulty === d.value
                   ? 'border-primary bg-primary/20 box-glow-cyan'
                   : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
               )}
             >
               <div className="font-display text-sm">{d.label}</div>
               <div className="text-xs text-muted-foreground font-mono">{d.desc}</div>
             </button>
           ))}
         </div>
       </div>
 
       {/* Game Mode Selection */}
       <div className="space-y-2">
         <label className="font-display text-sm text-primary text-glow-cyan block">
           GAME MODE
         </label>
         <div className="grid grid-cols-2 gap-2">
           {gameModes.map((mode) => (
             <button
               key={mode.value}
               type="button"
               onClick={() => setGameMode(mode.value)}
               disabled={isLoading}
               className={cn(
                 'p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2',
                 gameMode === mode.value
                   ? 'border-secondary bg-secondary/20 box-glow-pink'
                   : 'border-border bg-muted/30 hover:border-secondary/50 hover:bg-muted/50'
               )}
             >
               {mode.icon}
               <span className="font-display text-sm">{mode.label}</span>
             </button>
           ))}
         </div>
       </div>
 
       {/* Generate Button */}
       <Button
         type="submit"
         disabled={!theme.trim() || isLoading || disabled}
         className="w-full h-12 font-display text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
       >
         {isLoading ? (
           <>
             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
             GENERATING...
           </>
         ) : (
           <>
             <Sparkles className="w-5 h-5 mr-2" />
             GENERATE PUZZLE
           </>
         )}
       </Button>
     </form>
   );
 }