 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { theme } = await req.json();
     
     if (!theme || typeof theme !== 'string') {
       return new Response(
         JSON.stringify({ error: "Theme is required" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       console.error("LOVABLE_API_KEY is not configured");
       return new Response(
         JSON.stringify({ error: "AI service not configured" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const systemPrompt = `You are a word generator for a word search puzzle game. Generate exactly 15 unique words related to the given theme. 
 
 Rules:
 - Each word must be between 3 and 10 characters
 - Words must be single words (no spaces or hyphens)
 - Words must be appropriate for all ages
 - Words should be commonly known and related to the theme
 - Return ONLY a JSON array of 15 strings, nothing else
 
 Example output format:
 ["DINOSAUR","FOSSIL","RAPTOR","TREX","BONE","EXTINCT","JURASSIC","VOLCANO","METEOR","ANCIENT","REPTILE","SCALES","TEETH","CLAW","TAIL"]`;
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: systemPrompt },
           { role: "user", content: `Generate 15 words for the theme: "${theme}"` },
         ],
       }),
     });
 
     if (!response.ok) {
       if (response.status === 429) {
         return new Response(
           JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       if (response.status === 402) {
         return new Response(
           JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
           { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       const errorText = await response.text();
       console.error("AI gateway error:", response.status, errorText);
       return new Response(
         JSON.stringify({ error: "Failed to generate words" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const data = await response.json();
     const content = data.choices?.[0]?.message?.content;
 
     if (!content) {
       console.error("No content in AI response");
       return new Response(
         JSON.stringify({ error: "Invalid AI response" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Parse the JSON array from the response
     let words: string[];
     try {
       // Try to extract JSON array from the response
       const jsonMatch = content.match(/\[[\s\S]*\]/);
       if (jsonMatch) {
         words = JSON.parse(jsonMatch[0]);
       } else {
         throw new Error("No JSON array found");
       }
     } catch (parseError) {
       console.error("Failed to parse AI response:", content);
       return new Response(
         JSON.stringify({ error: "Failed to parse word list" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Validate and clean the words
     const validWords = words
       .filter((w): w is string => typeof w === 'string')
       .map(w => w.toUpperCase().replace(/[^A-Z]/g, ''))
       .filter(w => w.length >= 3 && w.length <= 10)
       .slice(0, 15);
 
     if (validWords.length < 5) {
       return new Response(
         JSON.stringify({ error: "Not enough valid words generated. Please try a different theme." }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ words: validWords }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
 
   } catch (error) {
     console.error("Error in generate-words function:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });