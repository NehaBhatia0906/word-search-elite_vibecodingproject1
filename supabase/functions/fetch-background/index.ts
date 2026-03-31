import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { theme } = await req.json();
    
    if (!theme || typeof theme !== 'string') {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation: length and character sanitization
    const sanitizedTheme = theme.trim().replace(/[^a-zA-Z0-9\s',.-]/g, '').slice(0, 100);
    if (sanitizedTheme.length < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid theme" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");
    if (!UNSPLASH_ACCESS_KEY) {
      console.error("UNSPLASH_ACCESS_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Unsplash API not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a more aesthetic search query
    const searchQuery = sanitizedTheme.toLowerCase().includes('bollywood')
      ? 'Bollywood movie cinematography'
      : `${sanitizedTheme} aesthetic cinematic`;

    const searchParams = new URLSearchParams({
      query: searchQuery,
      orientation: 'landscape',
      per_page: '10',
      order_by: 'relevant',
    });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsplash API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch background image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/photos/random?query=nature&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return new Response(
          JSON.stringify({
            url: fallbackData.urls.regular,
            blur_hash: fallbackData.blur_hash,
            color: fallbackData.color,
            photographer: fallbackData.user?.name || 'Unknown',
            photographer_url: fallbackData.user?.links?.html || '',
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "No images found for this theme" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
    const image = data.results[randomIndex];

    return new Response(
      JSON.stringify({
        url: image.urls.regular,
        blur_hash: image.blur_hash,
        color: image.color,
        photographer: image.user?.name || 'Unknown',
        photographer_url: image.user?.links?.html || '',
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in fetch-background function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
