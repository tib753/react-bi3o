import { useQuery } from "react-query";
import { placeApiAutocomplete_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

// Global AutocompleteService instance
let autocompleteService = null;

// Initialize Google Places AutocompleteService
const getAutocompleteService = () => {
  if (typeof window === "undefined") return null;
  
  if (!autocompleteService && window.google?.maps?.places?.AutocompleteService) {
    autocompleteService = new window.google.maps.places.AutocompleteService();
  }
  
  return autocompleteService;
};

// Client-side Google Places API using Google Maps JavaScript SDK (no CORS issues)
const getGooglePlacesPredictions = async (searchKey) => {
  return new Promise((resolve) => {
    const service = getAutocompleteService();
    
    if (!service) {
      console.log('Google Maps AutocompleteService not available yet');
      resolve({ predictions: [] });
      return;
    }

    const language = typeof window !== "undefined" 
      ? JSON.parse(localStorage.getItem("language-setting"))?.languageCode || 'ar'
      : 'ar';

    const request = {
      input: searchKey,
      language: language,
      types: ['geocode', 'establishment'],
    };

    service.getPlacePredictions(request, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        resolve({
          predictions: predictions.map(p => ({
            place_id: p.place_id,
            description: p.description,
            structured_formatting: {
              main_text: p.structured_formatting?.main_text || '',
              secondary_text: p.structured_formatting?.secondary_text || '',
            }
          }))
        });
      } else {
        console.log('Google Places AutocompleteService status:', status);
        resolve({ predictions: [] });
      }
    });
  });
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
        console.log('Backend returned empty, trying Google Maps AutocompleteService...');
        return await getGooglePlacesPredictions(searchKey);
      }
      
      return data;
    } catch (error) {
      console.log('Backend API failed, trying Google Maps AutocompleteService...', error.message);
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
