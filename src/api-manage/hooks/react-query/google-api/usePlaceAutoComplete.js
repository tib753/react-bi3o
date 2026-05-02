import { useQuery } from "react-query";
import { placeApiAutocomplete_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

// Client-side Google Places API fallback
const getGooglePlacesPredictions = async (searchKey) => {
  try {
    // Try new Places API first
    const response = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        },
        body: JSON.stringify({
          input: searchKey,
          languageCode: typeof window !== "undefined" 
            ? JSON.parse(localStorage.getItem("language-setting"))?.languageCode || 'ar'
            : 'ar',
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        return {
          predictions: data.suggestions.map(s => ({
            place_id: s.placePrediction?.placeId,
            description: s.placePrediction?.text?.text,
            structured_formatting: {
              main_text: s.placePrediction?.structuredFormat?.mainText?.text,
              secondary_text: s.placePrediction?.structuredFormat?.secondaryText?.text,
            }
          }))
        };
      }
    }

    // Fallback to legacy Places API
    const legacyResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchKey)}&key=${GOOGLE_PLACES_API_KEY}&language=${typeof window !== "undefined" ? JSON.parse(localStorage.getItem("language-setting"))?.languageCode || 'ar' : 'ar'}&types=geocode|establishment`
    );

    const legacyData = await legacyResponse.json();
    
    if (legacyData.status === 'OK' && legacyData.predictions) {
      return {
        predictions: legacyData.predictions.map(p => ({
          place_id: p.place_id,
          description: p.description,
          structured_formatting: p.structured_formatting,
        }))
      };
    }

    console.log('Google Places API Error:', legacyData.status, legacyData.error_message);
    return { predictions: [] };
  } catch (error) {
    console.error('Client-side Google Places API Error:', error);
    return { predictions: [] };
  }
};

const getAutocompletePlace = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    try {
      // Try backend first
      const { data } = await MainApi.get(
        `${placeApiAutocomplete_api}?search_text=${searchKey}`
      );
      
      // If backend returns empty or error, use client-side Google Places
      if (!data || !data.predictions || data.predictions.length === 0) {
        console.log('Backend returned empty, trying client-side Google Places API...');
        return await getGooglePlacesPredictions(searchKey);
      }
      
      return data;
    } catch (error) {
      console.log('Backend API failed, trying client-side Google Places API...', error.message);
      // Backend failed, use client-side Google Places
      return await getGooglePlacesPredictions(searchKey);
    }
  }
};

export default function useGetAutocompletePlace(searchKey, enabled) {
  return useQuery(
    ["places", searchKey],
    () => getAutocompletePlace(searchKey),
    {
      enabled: enabled,
      onError: (error) => {
        console.error('useGetAutocompletePlace error:', error);
        // Don't show error toast for client-side fallback
      },
    }
  );
}
