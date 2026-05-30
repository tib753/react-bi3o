import { useQuery } from "react-query";
import { placedetails_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const fetchClientSidePlaceDetails = async (placeId) => {
  if (
    typeof window === "undefined" ||
    !window.google?.maps?.places?.Place?.fetchPlace
  ) {
    return null;
  }
  try {
    const { place } = await window.google.maps.places.Place.fetchPlace({
      id: placeId,
      fields: ["formattedAddress", "location"],
    });
    if (place?.formattedAddress && place?.location) {
      return {
        place_id: placeId,
        formattedAddress: place.formattedAddress,
        location: {
          latitude: place.location.lat(),
          longitude: place.location.lng(),
        },
      };
    }
  } catch (error) {
    console.log("NEW Places API details failed:", error.message);
  }
  return null;
};

const fetchWithClassicAPI = (placeId) => {
  return new Promise((resolve) => {
    if (!window.google?.maps?.places?.PlacesService) {
      resolve(null);
      return;
    }
    const div = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(div);
    service.getDetails(
      { placeId, fields: ["formatted_address", "geometry"] },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          resolve({
            place_id: placeId,
            formattedAddress: place.formatted_address,
            location: {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            },
          });
        } else {
          console.log("Classic Places API failed:", status);
          resolve(null);
        }
      }
    );
  });
};

const getPlaceDetails = async (placeId) => {
  if (!placeId) return null;

  // 1️⃣ Backend
  try {
    const { data } = await MainApi.get(
      `${placedetails_api}?placeid=${placeId}`
    );
    if (data?.location) {
      console.log("✅ Backend place details OK");
      return { place_id: placeId, ...data };
    }
    console.log("❌ Backend returned empty");
  } catch (error) {
    console.log("❌ Backend failed:", error.message);
  }

  // 2️⃣ NEW Places API (Place.fetchPlace)
  console.log("Trying NEW Places API (Place.fetchPlace)...");
  const newApiResult = await fetchClientSidePlaceDetails(placeId);
  if (newApiResult) {
    console.log("✅ NEW Places API OK");
    return newApiResult;
  }
  console.log("❌ NEW Places API failed");

  // 3️⃣ Classic Places API (PlacesService)
  console.log("Trying Classic Places API (PlacesService)...");
  const classicResult = await fetchWithClassicAPI(placeId);
  if (classicResult) {
    console.log("✅ Classic Places API OK");
    return classicResult;
  }
  console.log("❌ All three sources failed for placeId:", placeId);

  return null;
};

export default function useGetPlaceDetails(placeId, placeDetailsEnabled) {
  return useQuery({
    queryKey: ["placeDetails", placeId],
    queryFn: () => getPlaceDetails(placeId),
    enabled: !!placeId && placeDetailsEnabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
