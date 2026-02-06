import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Lightbulb, RotateCcw } from 'lucide-react';
import { Difficulty } from '@/lib/wordSearchGenerator';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  onGenerate: (theme: string, difficulty: Difficulty, gameMode: 'classic' | 'mystery') => void;
  onHint: () => void;
  onNewGame: () => void;
  isLoading: boolean;
  hasActivePuzzle: boolean;
  hintsRemaining: number;
}

export function GameControls({ 
  onGenerate, 
  onHint, 
  onNewGame, 
  isLoading, 
  hasActivePuzzle,
  hintsRemaining 
}: GameControlsProps) {
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
    { value: 'easy', label: 'Easy', desc: '10×10' },
    { value: 'medium', label: 'Medium', desc: '15×15' },
    { value: 'hard', label: 'Hard', desc: '20×20' },
  ];

  const gameModes: { value: 'classic' | 'mystery'; label: string; desc: string }[] = [
    { value: 'classic', label: 'Classic', desc: 'Show words' },
    { value: 'mystery', label: 'Mystery', desc: 'Hidden words' },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Theme Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground block">
            Theme
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., Ocean, Space, Formula 1..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isLoading}
              className="pl-10 bg-background/60 border-border/50 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground block">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                disabled={isLoading}
                className={cn(
                  'p-3 rounded-xl border transition-all duration-200 text-center',
                  difficulty === d.value
                    ? 'border-primary bg-primary/10 shadow-soft'
                    : 'border-border/50 bg-background/40 hover:border-primary/30 hover:bg-background/60'
                )}
              >
                <div className="font-medium text-sm">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground block">
            Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {gameModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setGameMode(mode.value)}
                disabled={isLoading}
                className={cn(
                  'p-3 rounded-xl border transition-all duration-200 text-center',
                  gameMode === mode.value
                    ? 'border-secondary bg-secondary/10 shadow-soft'
                    : 'border-border/50 bg-background/40 hover:border-secondary/30 hover:bg-background/60'
                )}
              >
                <div className="font-medium text-sm">{mode.label}</div>
                <div className="text-xs text-muted-foreground">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          disabled={!theme.trim() || isLoading}
          className="w-full h-12 font-medium text-base bg-primary hover:bg-primary/90 transition-colors rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Puzzle'
          )}
        </Button>
      </form>

      {/* Game Action Buttons */}
      {hasActivePuzzle && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
          <Button
            variant="outline"
            onClick={onHint}
            disabled={hintsRemaining <= 0}
            className="h-11 rounded-xl border-border/50 bg-background/40 hover:bg-pastel-lavender/30"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({hintsRemaining})
          </Button>
          <Button
            variant="outline"
            onClick={onNewGame}
            className="h-11 rounded-xl border-border/50 bg-background/40 hover:bg-pastel-pink/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      )}
    </div>
  );
}
