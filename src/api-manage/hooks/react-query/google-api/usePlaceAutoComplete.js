import { useQuery } from "react-query";
import { placeApiAutocomplete_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

// Client-side Google Places API using NEW Places API (AutocompleteSuggestion)
// This replaces the deprecated AutocompleteService which was discontinued in March 2025
const getGooglePlacesPredictions = async (searchKey) => {
  if (typeof window === "undefined") {
    return { predictions: [] };
  }

  try {
    // Check if NEW Places API is available (AutocompleteSuggestion)
    if (!window.google?.maps?.places?.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
      console.log('NEW Google Places API (AutocompleteSuggestion) not available');
      return { predictions: [] };
    }

    const language = typeof window !== "undefined" 
      ? JSON.parse(localStorage.getItem("language-setting"))?.languageCode || 'ar'
      : 'ar';

    // NEW Places API request format
    const request = {
      input: searchKey,
      language: language,
      includedPrimaryTypes: ["locality", "sublocality", "neighborhood", "route", "establishment"],
    };

    // Use NEW API: AutocompleteSuggestion.fetchAutocompleteSuggestions (returns Promise)
    const response = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
    
    if (response?.suggestions && response.suggestions.length > 0) {
      return {
        predictions: response.suggestions.map(s => ({
          place_id: s.placePrediction?.placeId,
          description: s.placePrediction?.text?.text,
          structured_formatting: {
            main_text: s.placePrediction?.structuredFormat?.mainText?.text || '',
            secondary_text: s.placePrediction?.structuredFormat?.secondaryText?.text || '',
          }
        }))
      };
    }

    console.log('NEW Google Places API returned no suggestions');
    return { predictions: [] };
    
  } catch (error) {
    console.error('NEW Google Places API Error:', error);
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
      
      // If backend returns empty or error, use client-side Google Places NEW API
      if (!data || !data.predictions || data.predictions.length === 0) {
        console.log('Backend returned empty, trying NEW Google Places API...');
        return await getGooglePlacesPredictions(searchKey);
      }
      
      return data;
    } catch (error) {
      console.log('Backend API failed, trying NEW Google Places API...', error.message);
      // Backend failed, use client-side Google Places NEW API
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
