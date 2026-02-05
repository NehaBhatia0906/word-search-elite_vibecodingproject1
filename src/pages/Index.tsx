import { useWordSearch } from '@/hooks/useWordSearch';
import { GameControls } from '@/components/GameControls';
import { WordSearchGrid } from '@/components/WordSearchGrid';
import { WordList } from '@/components/WordList';
import { VictoryOverlay } from '@/components/VictoryOverlay';
import { Search } from 'lucide-react';

const Index = () => {
  const {
    puzzle,
    words,
    foundWords,
    isLoading,
    gameMode,
    theme,
    isVictory,
    generateNewPuzzle,
    onWordFound,
    resetGame,
  } = useWordSearch();

  return (
    <div className="min-h-screen py-8 px-4 grid-pattern">
      {/* Victory Overlay */}
      {isVictory && (
        <VictoryOverlay wordsFound={foundWords.size} onPlayAgain={resetGame} />
      )}

      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center box-glow-cyan">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-glow-cyan text-primary">
              WORD SEARCH
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            AI-Powered Puzzle Generator
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl neon-border bg-card/50 backdrop-blur-sm">
              <GameControls
                onGenerate={generateNewPuzzle}
                isLoading={isLoading}
                disabled={false}
              />
            </div>

            {/* Word List (visible when puzzle exists) */}
            {puzzle && (
              <WordList
                words={words}
                foundWords={foundWords}
                gameMode={gameMode}
              />
            )}
          </div>

          {/* Right Panel - Grid */}
          <div className="flex flex-col items-center justify-start">
            {puzzle ? (
              <>
                <div className="mb-4 text-center">
                  <p className="font-display text-lg text-secondary text-glow-pink">
                    {theme.toUpperCase()}
                  </p>
                </div>
                <div className="overflow-x-auto max-w-full">
                  <WordSearchGrid
                    grid={puzzle.grid}
                    placedWords={puzzle.placedWords}
                    foundWords={foundWords}
                    onWordFound={onWordFound}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8 rounded-xl neon-border bg-card/30 backdrop-blur-sm max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground mb-3">
                    Ready to Play?
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    Enter a theme and generate your custom word search puzzle powered by AI
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-muted-foreground text-xs font-mono">
            Drag across letters to select words • Works on desktop and mobile
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
