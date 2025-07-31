import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

interface AutocompleteRequest {
  input: string;
  sessionToken?: string;
}

interface PlaceDetailsRequest {
  placeId: string;
  sessionToken?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Google Maps API key not configured" }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        } 
      }
    );
  }

  try {
    const { action, ...params } = await req.json();

    let response;

    if (action === "autocomplete") {
      const { input, sessionToken }: AutocompleteRequest = params;
      
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.set("input", input);
      url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
      // Remove types restriction to allow all addresses, establishments, and places
      url.searchParams.set("components", "country:in"); // Restrict to India
      
      if (sessionToken) {
        url.searchParams.set("sessiontoken", sessionToken);
      }

      response = await fetch(url.toString());
      
    } else if (action === "placeDetails") {
      const { placeId, sessionToken }: PlaceDetailsRequest = params;
      
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
      url.searchParams.set("fields", "geometry,address_components,formatted_address,name");
      
      if (sessionToken) {
        url.searchParams.set("sessiontoken", sessionToken);
      }

      response = await fetch(url.toString());
      
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          } 
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });

  } catch (error) {
    console.error("Maps API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        } 
      }
    );
  }
});