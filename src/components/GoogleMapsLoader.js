import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect } from "react";

// This component loads the Google Maps JavaScript SDK early in the app lifecycle
// to ensure AutocompleteService is available for the usePlaceAutoComplete hook
const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script-global",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: ["places"],
    language: typeof window !== "undefined" 
      ? JSON.parse(localStorage.getItem("language-setting"))?.languageCode || "ar"
      : "ar",
  });

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps failed to load:", loadError);
    }
    if (isLoaded) {
      console.log("Google Maps SDK loaded successfully with Places library");
    }
  }, [isLoaded, loadError]);

  // Always render children - the hook will handle when the service is available
  return children;
};

export default GoogleMapsLoader;
