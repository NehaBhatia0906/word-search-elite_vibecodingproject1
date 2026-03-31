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
          <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
            {/* Left Panel - Controls (order 1 on mobile, stays left on desktop) */}
            <div className="space-y-6 order-1 lg:order-none">
              <div className="p-4 sm:p-6 rounded-2xl glass-strong shadow-soft animate-fade-in">
                <GameControls
                  onGenerate={generateNewPuzzle}
                  onHint={useHint}
                  onNewGame={resetGame}
                  isLoading={isLoading}
                  hasActivePuzzle={!!puzzle}
                  hintsRemaining={hintsRemaining}
                />
              </div>

              {/* Word List - hidden on mobile when puzzle exists, shown below grid */}
              {puzzle && (
                <div className="hidden lg:block">
                  <WordList
                    words={words}
                    foundWords={foundWords}
                    gameMode={gameMode}
                  />
                </div>
              )}
            </div>

            {/* Right Panel - Grid (order 2 on mobile) */}
            <div className="flex flex-col items-center justify-start order-2 lg:order-none">
              {puzzle ? (
                <>
                  <div className="mb-4 sm:mb-5 text-center animate-fade-in">
                    <p className="font-display text-xl sm:text-2xl text-foreground capitalize">
                      {theme}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Find all {words.length} words
                    </p>
                  </div>
                  <div className="overflow-x-auto max-w-full px-2">
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
                <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                  <div className="text-center p-6 sm:p-10 rounded-3xl glass-strong shadow-soft max-w-md animate-fade-in">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Grid3X3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2 sm:mb-3">
                      Ready to Play?
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Enter a theme to generate your personalized word search puzzle with a matching background
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Word List - shown below grid on mobile only */}
            {puzzle && (
              <div className="block lg:hidden order-3">
                <WordList
                  words={words}
                  foundWords={foundWords}
                  gameMode={gameMode}
                />
              </div>
            )}
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
