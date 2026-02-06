import { useWordSearch } from '@/hooks/useWordSearch';
import { GameControls } from '@/components/GameControls';
import { WordSearchGrid } from '@/components/WordSearchGrid';
import { WordList } from '@/components/WordList';
import { VictoryOverlay } from '@/components/VictoryOverlay';
import { DynamicBackground } from '@/components/DynamicBackground';
import { Grid3X3 } from 'lucide-react';

const Index = () => {
  const {
    puzzle,
    words,
    foundWords,
    isLoading,
    gameMode,
    theme,
    isVictory,
    backgroundImage,
    hintsRemaining,
    hintCells,
    generateNewPuzzle,
    onWordFound,
    useHint,
    resetGame,
  } = useWordSearch();

  return (
    <DynamicBackground
      imageUrl={backgroundImage?.url || null}
      photographer={backgroundImage?.photographer}
      photographerUrl={backgroundImage?.photographerUrl}
    >
      {/* Victory Overlay */}
      {isVictory && (
        <VictoryOverlay wordsFound={foundWords.size} onPlayAgain={resetGame} />
      )}

      <div className="min-h-screen py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
                Word Search
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered puzzles with beautiful backgrounds
            </p>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass-strong shadow-soft animate-fade-in">
                <GameControls
                  onGenerate={generateNewPuzzle}
                  onHint={useHint}
                  onNewGame={resetGame}
                  isLoading={isLoading}
                  hasActivePuzzle={!!puzzle}
                  hintsRemaining={hintsRemaining}
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
                  <div className="mb-5 text-center animate-fade-in">
                    <p className="font-display text-2xl text-foreground capitalize">
                      {theme}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Find all {words.length} words
                    </p>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <WordSearchGrid
                      grid={puzzle.grid}
                      placedWords={puzzle.placedWords}
                      foundWords={foundWords}
                      hintCells={hintCells}
                      onWordFound={onWordFound}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <div className="text-center p-10 rounded-3xl glass-strong shadow-soft max-w-md animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Grid3X3 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display text-3xl text-foreground mb-3">
                      Ready to Play?
                    </h2>
                    <p className="text-muted-foreground">
                      Enter a theme to generate your personalized word search puzzle with a matching background
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center animate-fade-in">
            <p className="text-muted-foreground text-xs">
              Drag across letters to select words • Works on desktop and mobile
            </p>
          </footer>
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Index;
