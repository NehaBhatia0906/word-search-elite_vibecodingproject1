 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { generatePuzzle, GeneratedPuzzle, Difficulty } from '@/lib/wordSearchGenerator';
 import { toast } from 'sonner';
 
 interface GameState {
   puzzle: GeneratedPuzzle | null;
   words: string[];
   foundWords: Set<string>;
   isLoading: boolean;
   gameMode: 'classic' | 'mystery';
   difficulty: Difficulty;
   theme: string;
   isVictory: boolean;
 }
 
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
   });
 
   const generateNewPuzzle = useCallback(
     async (theme: string, difficulty: Difficulty, gameMode: 'classic' | 'mystery') => {
       setState((prev) => ({ ...prev, isLoading: true, isVictory: false }));
 
       try {
         // Call the edge function to generate words
         const { data, error } = await supabase.functions.invoke('generate-words', {
           body: { theme },
         });
 
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
         });
 
         toast.success(`Puzzle generated with ${puzzle.placedWords.length} words!`);
       } catch (error) {
         console.error('Error generating puzzle:', error);
         toast.error(error instanceof Error ? error.message : 'Failed to generate puzzle');
         setState((prev) => ({ ...prev, isLoading: false }));
       }
     },
     []
   );
 
   const onWordFound = useCallback((word: string) => {
     setState((prev) => {
       const newFoundWords = new Set(prev.foundWords);
       newFoundWords.add(word);
 
       const isVictory = newFoundWords.size === prev.words.length;
 
       if (!isVictory) {
         toast.success(`Found: ${word}!`, {
           duration: 1500,
         });
       }
 
       return {
         ...prev,
         foundWords: newFoundWords,
         isVictory,
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
     });
   }, []);
 
   return {
     ...state,
     generateNewPuzzle,
     onWordFound,
     resetGame,
   };
 }