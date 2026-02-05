 import { cn } from '@/lib/utils';
 
 interface WordListProps {
   words: string[];
   foundWords: Set<string>;
   gameMode: 'classic' | 'mystery';
 }
 
 export function WordList({ words, foundWords, gameMode }: WordListProps) {
   const sortedWords = [...words].sort();
 
   if (gameMode === 'mystery') {
     return (
       <div className="p-4 rounded-lg neon-border bg-card/50 backdrop-blur-sm">
         <h3 className="font-display text-lg text-primary text-glow-cyan mb-3">
           WORDS FOUND
         </h3>
         <div className="text-4xl font-display font-bold text-center">
           <span className="text-neon-green text-glow-cyan">{foundWords.size}</span>
           <span className="text-muted-foreground mx-2">/</span>
           <span className="text-foreground">{words.length}</span>
         </div>
         <p className="text-muted-foreground text-sm text-center mt-2 font-mono">
           Find all hidden words
         </p>
       </div>
     );
   }
 
   return (
     <div className="p-4 rounded-lg neon-border bg-card/50 backdrop-blur-sm">
       <h3 className="font-display text-lg text-primary text-glow-cyan mb-3">
         WORD LIST
       </h3>
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
         {sortedWords.map((word) => {
           const isFound = foundWords.has(word);
           return (
             <div
               key={word}
               className={cn(
                 'px-3 py-1.5 rounded font-mono text-sm transition-all duration-300',
                 isFound
                   ? 'bg-neon-green/20 text-neon-green line-through decoration-2 box-glow-green'
                   : 'bg-muted/50 text-foreground hover:bg-muted'
               )}
             >
               {word}
             </div>
           );
         })}
       </div>
       <div className="mt-4 pt-3 border-t border-border">
         <div className="flex justify-between text-sm">
           <span className="text-muted-foreground">Progress</span>
           <span className="font-mono">
             <span className="text-neon-green">{foundWords.size}</span>
             <span className="text-muted-foreground"> / {words.length}</span>
           </span>
         </div>
         <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
           <div
             className="h-full bg-gradient-to-r from-primary to-neon-green transition-all duration-500"
             style={{ width: `${(foundWords.size / words.length) * 100}%` }}
           />
         </div>
       </div>
     </div>
   );
 }