import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generatePuzzle, GeneratedPuzzle, Difficulty, PlacedWord } from '@/lib/wordSearchGenerator';
import { toast } from 'sonner';

interface BackgroundImage {
  url: string;
  photographer?: string;
  photographerUrl?: string;
}

interface GameState {
  puzzle: GeneratedPuzzle | null;
  words: string[];
  foundWords: Set<string>;
  isLoading: boolean;
  gameMode: 'classic' | 'mystery';
  difficulty: Difficulty;
  theme: string;
  isVictory: boolean;
  backgroundImage: BackgroundImage | null;
  hintsRemaining: number;
  hintCells: Set<string>;
}

const INITIAL_HINTS = 3;

export function useWordSearch() {
  const [state, setState] = useState<GameState>({
    puzzle: null,
    words: [],
    foundWords: new Set(),
    isLoading: false,
    gameMode: 'classic',
    difficulty: 'easy',
    theme: '',
    isVictory: false,
    backgroundImage: null,
    hintsRemaining: INITIAL_HINTS,
    hintCells: new Set(),
  });

  const fetchBackgroundImage = useCallback(async (theme: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-background', {
        body: { theme },
      });

      if (error) {
        console.error('Background fetch error:', error);
        return null;
      }

      if (data?.url) {
        return {
          url: data.url,
          photographer: data.photographer,
          photographerUrl: data.photographer_url,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching background:', error);
      return null;
    }
  }, []);

  const generateNewPuzzle = useCallback(
    async (theme: string, difficulty: Difficulty, gameMode: 'classic' | 'mystery') => {
      setState((prev) => ({ ...prev, isLoading: true, isVictory: false, hintCells: new Set() }));

      try {
        // Fetch background and words in parallel
        const [backgroundResult, wordsResult] = await Promise.all([
          fetchBackgroundImage(theme),
          supabase.functions.invoke('generate-words', {
            body: { theme },
          }),
        ]);

        const { data, error } = wordsResult;

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Failed to generate words');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        const words: string[] = data?.words;
        if (!words || words.length < 5) {
          throw new Error('Not enough words generated');
        }

        // Generate the puzzle grid
        const puzzle = generatePuzzle(words, difficulty);

        setState({
          puzzle,
          words: puzzle.placedWords.map((pw) => pw.word),
          foundWords: new Set(),
          isLoading: false,
          gameMode,
          difficulty,
          theme,
          isVictory: false,
          backgroundImage: backgroundResult,
          hintsRemaining: INITIAL_HINTS,
          hintCells: new Set(),
        });

        toast.success(`Found ${puzzle.placedWords.length} words for "${theme}"`, {
          duration: 2000,
        });
      } catch (error) {
        console.error('Error generating puzzle:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to generate puzzle');
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [fetchBackgroundImage]
  );

  const onWordFound = useCallback((word: string) => {
    setState((prev) => {
      const newFoundWords = new Set(prev.foundWords);
      newFoundWords.add(word);

      // Remove hint cells for the found word
      const newHintCells = new Set(prev.hintCells);
      const foundPlacedWord = prev.puzzle?.placedWords.find(pw => pw.word === word);
      if (foundPlacedWord) {
        foundPlacedWord.cells.forEach(cell => {
          newHintCells.delete(`${cell.row}-${cell.col}`);
        });
      }

      const isVictory = newFoundWords.size === prev.words.length;

      if (!isVictory) {
        toast.success(`Found: ${word}`, {
          duration: 1500,
        });
      }

      return {
        ...prev,
        foundWords: newFoundWords,
        hintCells: newHintCells,
        isVictory,
      };
    });
  }, []);

  const useHint = useCallback(() => {
    setState((prev) => {
      if (prev.hintsRemaining <= 0 || !prev.puzzle) return prev;

      // Find an unfound word
      const unfoundWords = prev.puzzle.placedWords.filter(
        (pw) => !prev.foundWords.has(pw.word)
      );

      if (unfoundWords.length === 0) return prev;

      // Pick a random unfound word
      const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
      
      // Add its cells to hint cells
      const newHintCells = new Set(prev.hintCells);
      randomWord.cells.forEach((cell) => {
        newHintCells.add(`${cell.row}-${cell.col}`);
      });

      toast.info(`Hint: Look for a ${randomWord.word.length}-letter word`, {
        duration: 3000,
      });

      // Clear hint after 3 seconds
      setTimeout(() => {
        setState((current) => ({
          ...current,
          hintCells: new Set(),
        }));
      }, 3000);

      return {
        ...prev,
        hintsRemaining: prev.hintsRemaining - 1,
        hintCells: newHintCells,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState({
      puzzle: null,
      words: [],
      foundWords: new Set(),
      isLoading: false,
      gameMode: 'classic',
      difficulty: 'easy',
      theme: '',
      isVictory: false,
      backgroundImage: null,
      hintsRemaining: INITIAL_HINTS,
      hintCells: new Set(),
    });
  }, []);

  return {
    ...state,
    generateNewPuzzle,
    onWordFound,
    useHint,
    resetGame,
  };
}
