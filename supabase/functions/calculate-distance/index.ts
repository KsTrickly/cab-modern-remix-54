
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pickupCity, destinationCity } = await req.json()
    console.log(`Calculating distance between: ${pickupCity} and ${destinationCity}`)
    
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleMapsApiKey) {
      console.error('Google Maps API key not configured')
      const fallbackDistance = estimateFallbackDistance(pickupCity, destinationCity)
      return new Response(
        JSON.stringify({ 
          distance: fallbackDistance, 
          warning: 'Google Maps API key not configured - using estimated distance',
          error: 'API key missing'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use the Distance Matrix API for better reliability
    const origin = encodeURIComponent(pickupCity)
    const destination = encodeURIComponent(destinationCity)
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=${googleMapsApiKey}`
    
    console.log(`Making request to: ${url}`)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Google Distance Matrix API response:', JSON.stringify(data, null, 2))
    
    if (response.ok && data.status === 'OK' && data.rows && data.rows.length > 0) {
      const element = data.rows[0].elements[0]
      
      if (element.status === 'OK' && element.distance) {
        const distanceInMeters = element.distance.value
        const distanceInKm = Math.round(distanceInMeters / 1000)
        
        console.log(`Distance calculated successfully: ${distanceInKm} km`)
        
        return new Response(
          JSON.stringify({ distance: distanceInKm }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        console.error('Distance Matrix element error:', element.status)
        const fallbackDistance = estimateFallbackDistance(pickupCity, destinationCity)
        
        return new Response(
          JSON.stringify({ 
            distance: fallbackDistance, 
            warning: 'Could not calculate exact distance - using estimated distance',
            error: `Google Maps API error: ${element.status}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      console.error('Distance Matrix API error:', data)
      const fallbackDistance = estimateFallbackDistance(pickupCity, destinationCity)
      
      return new Response(
        JSON.stringify({ 
          distance: fallbackDistance, 
          warning: 'API calculation failed - using estimated distance',
          error: data.error_message || 'Distance calculation failed'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Error calculating distance:', error)
    
    let pickupCity = 'Unknown'
    let destinationCity = 'Unknown'
    
    try {
      const body = await req.json()
      pickupCity = body.pickupCity || 'Unknown'
      destinationCity = body.destinationCity || 'Unknown'
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
    }
    
    const fallbackDistance = estimateFallbackDistance(pickupCity, destinationCity)
    
    return new Response(
      JSON.stringify({ 
        distance: fallbackDistance, 
        warning: 'Distance calculation error - using estimated distance',
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 200, // Return 200 to avoid breaking the UI
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function estimateFallbackDistance(pickupCity: string, destinationCity: string): number {
  console.log(`Using fallback distance estimation for: ${pickupCity} to ${destinationCity}`)
  
  // Enhanced fallback estimation with more city pairs
  const cityDistances: { [key: string]: number } = {
    // Major city pairs in India
    'delhi-mumbai': 1400, 'mumbai-delhi': 1400,
    'delhi-bangalore': 2100, 'bangalore-delhi': 2100,
    'mumbai-bangalore': 980, 'bangalore-mumbai': 980,
    'delhi-chennai': 2200, 'chennai-delhi': 2200,
    'mumbai-chennai': 1340, 'chennai-mumbai': 1340,
    'delhi-kolkata': 1500, 'kolkata-delhi': 1500,
    'varanasi-hyderabad': 1200, 'hyderabad-varanasi': 1200,
    'delhi-hyderabad': 1600, 'hyderabad-delhi': 1600,
    'mumbai-hyderabad': 700, 'hyderabad-mumbai': 700,
    'varanasi-delhi': 800, 'delhi-varanasi': 800,
    'varanasi-mumbai': 1200, 'mumbai-varanasi': 1200,
    'varanasi-bangalore': 1500, 'bangalore-varanasi': 1500,
    'varanasi-chennai': 1300, 'chennai-varanasi': 1300,
    'varanasi-kolkata': 700, 'kolkata-varanasi': 700,
    // Add more combinations as needed
  }
  
  const normalizeCity = (city: string) => {
    return city.toLowerCase()
      .replace(/[^a-z\s]/g, '') // Remove special characters
      .trim()
      .split(' ')[0] // Take first word for common matches
  }
  
  const normalizedPickup = normalizeCity(pickupCity)
  const normalizedDestination = normalizeCity(destinationCity)
  
  const key1 = `${normalizedPickup}-${normalizedDestination}`
  const key2 = `${normalizedDestination}-${normalizedPickup}`
  
  const estimatedDistance = cityDistances[key1] || cityDistances[key2] || 500
  
  console.log(`Fallback distance for ${key1}: ${estimatedDistance} km`)
  return estimatedDistance
}
