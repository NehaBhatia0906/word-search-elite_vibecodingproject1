import { cn } from '@/lib/utils';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
  gameMode: 'classic' | 'mystery';
}

export function WordList({ words, foundWords, gameMode }: WordListProps) {
  const sortedWords = [...words].sort();
  const progress = (foundWords.size / words.length) * 100;

  if (gameMode === 'mystery') {
    return (
      <div className="p-5 rounded-2xl glass-strong shadow-soft animate-fade-in">
        <h3 className="font-display text-xl text-foreground mb-4">
          Words Found
        </h3>
        <div className="text-center py-4">
          <div className="text-5xl font-display font-semibold text-foreground">
            <span className="text-primary">{foundWords.size}</span>
            <span className="text-muted-foreground mx-2 text-3xl">of</span>
            <span>{words.length}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-3">
            theme words hidden
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl glass-strong shadow-soft animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-foreground">
          Word List
        </h3>
        <span className="text-sm text-muted-foreground">
          {foundWords.size} / {words.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {sortedWords.map((word) => {
          const isFound = foundWords.has(word);
          return (
            <div
              key={word}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                isFound
                  ? 'word-found bg-pastel-green/30'
                  : 'bg-background/50 text-foreground'
              )}
            >
              {word}
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="mt-5 pt-4 border-t border-border/30">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
