 import { useState, useCallback, useRef, useEffect } from 'react';
 import { PlacedWord } from '@/lib/wordSearchGenerator';
 import { cn } from '@/lib/utils';
 
 interface WordSearchGridProps {
   grid: string[][];
   placedWords: PlacedWord[];
   foundWords: Set<string>;
   onWordFound: (word: string) => void;
 }
 
 interface Selection {
   cells: { row: number; col: number }[];
   isSelecting: boolean;
 }
 
 export function WordSearchGrid({
   grid,
   placedWords,
   foundWords,
   onWordFound,
 }: WordSearchGridProps) {
   const [selection, setSelection] = useState<Selection>({
     cells: [],
     isSelecting: false,
   });
   const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
   const gridRef = useRef<HTMLDivElement>(null);
 
   // Get all cells that belong to found words
   const foundCells = new Set<string>();
   placedWords.forEach((pw) => {
     if (foundWords.has(pw.word)) {
       pw.cells.forEach((cell) => {
         foundCells.add(`${cell.row}-${cell.col}`);
       });
     }
   });
 
   const getCellsInLine = useCallback(
     (start: { row: number; col: number }, end: { row: number; col: number }) => {
       const cells: { row: number; col: number }[] = [];
       const dRow = Math.sign(end.row - start.row);
       const dCol = Math.sign(end.col - start.col);
       
       // Must be in a straight line
       const rowDiff = Math.abs(end.row - start.row);
       const colDiff = Math.abs(end.col - start.col);
       
       if (rowDiff !== colDiff && rowDiff !== 0 && colDiff !== 0) {
         return [start];
       }
       
       const steps = Math.max(rowDiff, colDiff);
       for (let i = 0; i <= steps; i++) {
         cells.push({
           row: start.row + i * dRow,
           col: start.col + i * dCol,
         });
       }
       
       return cells;
     },
     []
   );
 
   const handleCellMouseDown = useCallback(
     (row: number, col: number) => {
       setStartCell({ row, col });
       setSelection({
         cells: [{ row, col }],
         isSelecting: true,
       });
     },
     []
   );
 
   const handleCellMouseEnter = useCallback(
     (row: number, col: number) => {
       if (selection.isSelecting && startCell) {
         const cells = getCellsInLine(startCell, { row, col });
         setSelection((prev) => ({ ...prev, cells }));
       }
     },
     [selection.isSelecting, startCell, getCellsInLine]
   );
 
   const handleMouseUp = useCallback(() => {
     if (selection.isSelecting && selection.cells.length > 1) {
       // Check if selection matches any word
       const selectedLetters = selection.cells
         .map((cell) => grid[cell.row][cell.col])
         .join('');
       const reversedLetters = [...selectedLetters].reverse().join('');
       
       for (const pw of placedWords) {
         if (!foundWords.has(pw.word)) {
           if (selectedLetters === pw.word || reversedLetters === pw.word) {
             // Check if cells match
             const cellsMatch = selection.cells.every((sc) =>
               pw.cells.some((pc) => pc.row === sc.row && pc.col === sc.col)
             );
             if (cellsMatch && selection.cells.length === pw.cells.length) {
               onWordFound(pw.word);
               break;
             }
           }
         }
       }
     }
     
     setSelection({ cells: [], isSelecting: false });
     setStartCell(null);
   }, [selection, grid, placedWords, foundWords, onWordFound]);
 
   // Handle touch events
   const handleTouchStart = useCallback(
     (e: React.TouchEvent, row: number, col: number) => {
       e.preventDefault();
       handleCellMouseDown(row, col);
     },
     [handleCellMouseDown]
   );
 
   const handleTouchMove = useCallback(
     (e: React.TouchEvent) => {
       e.preventDefault();
       const touch = e.touches[0];
       const element = document.elementFromPoint(touch.clientX, touch.clientY);
       if (element) {
         const row = element.getAttribute('data-row');
         const col = element.getAttribute('data-col');
         if (row !== null && col !== null) {
           handleCellMouseEnter(parseInt(row), parseInt(col));
         }
       }
     },
     [handleCellMouseEnter]
   );
 
   useEffect(() => {
     const handleGlobalMouseUp = () => {
       if (selection.isSelecting) {
         handleMouseUp();
       }
     };
     
     window.addEventListener('mouseup', handleGlobalMouseUp);
     window.addEventListener('touchend', handleGlobalMouseUp);
     
     return () => {
       window.removeEventListener('mouseup', handleGlobalMouseUp);
       window.removeEventListener('touchend', handleGlobalMouseUp);
     };
   }, [selection.isSelecting, handleMouseUp]);
 
   const gridSize = grid.length;
   const cellSize = gridSize <= 10 ? 'w-8 h-8 text-lg sm:w-10 sm:h-10 sm:text-xl' 
                  : gridSize <= 15 ? 'w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-base' 
                  : 'w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm';
 
   return (
     <div
       ref={gridRef}
       className="inline-block p-4 rounded-lg neon-border bg-card/50 backdrop-blur-sm select-none touch-none"
       onMouseLeave={() => {
         if (selection.isSelecting) {
           setSelection({ cells: [], isSelecting: false });
           setStartCell(null);
         }
       }}
     >
       <div
         className="grid gap-0.5"
         style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
       >
         {grid.map((row, rowIndex) =>
           row.map((letter, colIndex) => {
             const cellKey = `${rowIndex}-${colIndex}`;
             const isSelected = selection.cells.some(
               (c) => c.row === rowIndex && c.col === colIndex
             );
             const isFound = foundCells.has(cellKey);
 
             return (
               <div
                 key={cellKey}
                 data-row={rowIndex}
                 data-col={colIndex}
                 onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                 onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                 onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                 onTouchMove={handleTouchMove}
                 className={cn(
                   cellSize,
                   'flex items-center justify-center font-mono-grid font-semibold rounded-sm cursor-pointer transition-all duration-150',
                   'border border-border/30 bg-muted/30',
                   isFound && 'bg-neon-green/20 text-neon-green animate-glow-found border-neon-green/50',
                   isSelected && !isFound && 'bg-primary/30 text-primary box-glow-cyan border-primary/50',
                   !isFound && !isSelected && 'hover:bg-muted/50 hover:border-primary/30 text-foreground'
                 )}
               >
                 {letter}
               </div>
             );
           })
         )}
       </div>
     </div>
   );
 }