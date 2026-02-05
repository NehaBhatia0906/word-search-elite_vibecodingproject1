 export type Difficulty = 'easy' | 'medium' | 'hard';
 export type Direction = { dx: number; dy: number; name: string };
 
 export interface PlacedWord {
   word: string;
   startRow: number;
   startCol: number;
   direction: Direction;
   cells: { row: number; col: number }[];
 }
 
 export interface GeneratedPuzzle {
   grid: string[][];
   placedWords: PlacedWord[];
   size: number;
 }
 
 const DIRECTIONS: Record<Difficulty, Direction[]> = {
   easy: [
     { dx: 1, dy: 0, name: 'right' },
     { dx: 0, dy: 1, name: 'down' },
   ],
   medium: [
     { dx: 1, dy: 0, name: 'right' },
     { dx: 0, dy: 1, name: 'down' },
     { dx: 1, dy: 1, name: 'diagonal-down-right' },
   ],
   hard: [
     { dx: 1, dy: 0, name: 'right' },
     { dx: -1, dy: 0, name: 'left' },
     { dx: 0, dy: 1, name: 'down' },
     { dx: 0, dy: -1, name: 'up' },
     { dx: 1, dy: 1, name: 'diagonal-down-right' },
     { dx: -1, dy: 1, name: 'diagonal-down-left' },
     { dx: 1, dy: -1, name: 'diagonal-up-right' },
     { dx: -1, dy: -1, name: 'diagonal-up-left' },
   ],
 };
 
 const GRID_SIZES: Record<Difficulty, number> = {
   easy: 10,
   medium: 15,
   hard: 20,
 };
 
 function shuffleArray<T>(array: T[]): T[] {
   const shuffled = [...array];
   for (let i = shuffled.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
   }
   return shuffled;
 }
 
 function canPlaceWord(
   grid: string[][],
   word: string,
   startRow: number,
   startCol: number,
   direction: Direction
 ): boolean {
   const size = grid.length;
   
   for (let i = 0; i < word.length; i++) {
     const row = startRow + i * direction.dy;
     const col = startCol + i * direction.dx;
     
     if (row < 0 || row >= size || col < 0 || col >= size) {
       return false;
     }
     
     const currentCell = grid[row][col];
     if (currentCell !== '' && currentCell !== word[i]) {
       return false;
     }
   }
   
   return true;
 }
 
 function placeWord(
   grid: string[][],
   word: string,
   startRow: number,
   startCol: number,
   direction: Direction
 ): { row: number; col: number }[] {
   const cells: { row: number; col: number }[] = [];
   
   for (let i = 0; i < word.length; i++) {
     const row = startRow + i * direction.dy;
     const col = startCol + i * direction.dx;
     grid[row][col] = word[i];
     cells.push({ row, col });
   }
   
   return cells;
 }
 
 function tryPlaceWord(
   grid: string[][],
   word: string,
   directions: Direction[]
 ): PlacedWord | null {
   const size = grid.length;
   const shuffledDirections = shuffleArray(directions);
   
   // Try random positions
   const positions: { row: number; col: number }[] = [];
   for (let row = 0; row < size; row++) {
     for (let col = 0; col < size; col++) {
       positions.push({ row, col });
     }
   }
   const shuffledPositions = shuffleArray(positions);
   
   for (const { row, col } of shuffledPositions) {
     for (const direction of shuffledDirections) {
       if (canPlaceWord(grid, word, row, col, direction)) {
         const cells = placeWord(grid, word, row, col, direction);
         return {
           word,
           startRow: row,
           startCol: col,
           direction,
           cells,
         };
       }
     }
   }
   
   return null;
 }
 
 function fillEmptyCells(grid: string[][]): void {
   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   
   for (let row = 0; row < grid.length; row++) {
     for (let col = 0; col < grid[row].length; col++) {
       if (grid[row][col] === '') {
         grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
       }
     }
   }
 }
 
 export function generatePuzzle(
   words: string[],
   difficulty: Difficulty
 ): GeneratedPuzzle {
   const size = GRID_SIZES[difficulty];
   const directions = DIRECTIONS[difficulty];
   
   // Create empty grid
   const grid: string[][] = Array(size)
     .fill(null)
     .map(() => Array(size).fill(''));
   
   // Sort words by length (longest first for better placement)
   const sortedWords = [...words]
     .map(w => w.toUpperCase().replace(/[^A-Z]/g, ''))
     .filter(w => w.length >= 3 && w.length <= 10)
     .sort((a, b) => b.length - a.length);
   
   const placedWords: PlacedWord[] = [];
   
   for (const word of sortedWords) {
     const placed = tryPlaceWord(grid, word, directions);
     if (placed) {
       placedWords.push(placed);
     }
   }
   
   // Fill empty cells with random letters
   fillEmptyCells(grid);
   
   return { grid, placedWords, size };
 }
 
 export function getGridSize(difficulty: Difficulty): number {
   return GRID_SIZES[difficulty];
 }