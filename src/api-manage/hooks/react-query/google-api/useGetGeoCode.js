import { useQuery } from "react-query";
import { geocode_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const waitForGoogleMaps = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (window?.google?.maps?.Geocoder) {
      resolve(true);
      return;
    }
    const interval = setInterval(() => {
      if (window?.google?.maps?.Geocoder) {
        clearInterval(interval);
        resolve(true);
      }
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      resolve(false);
    }, timeout);
  });
};

const getGeoCode = async (location) => {
  if (!location) return { results: [] };

  const lat = parseFloat(location?.lat);
  const lng = parseFloat(location?.lng);

  if (isNaN(lat) || isNaN(lng)) return { results: [] };

  const coordFallback = `${lat?.toFixed(5)}, ${lng?.toFixed(5)}`;

  try {
    const { data } = await MainApi.get(
      `${geocode_api}?lat=${lat}&lng=${lng}`
    );
    if (data?.results?.length > 0) return data;
  } catch (error) {
    console.log("Backend geocode failed", error.message);
  }

  const mapsReady = await waitForGoogleMaps();

  if (mapsReady && window?.google?.maps?.Geocoder) {
    const googleResult = await new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.length > 0) {
            resolve({ results });
          } else {
            console.warn(
              "Client Geocoder status:",
              status,
              "→ trying Nominatim"
            );
            resolve(null);
          }
        }
      );
    });
    if (googleResult) return googleResult;
  }

  try {
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "Accept-Language": "ar,fr,en",
          "User-Agent": "ReactBi3oApp/1.0",
        },
      }
    );
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (nomData?.display_name) {
        return {
          results: [{ formatted_address: nomData.display_name }],
        };
      }
    }
  } catch (e) {
    console.log("Nominatim geocode failed", e.message);
  }

  return { results: [{ formatted_address: coordFallback }] };
};

export default function useGetGeoCode(location, geoLocationEnable = true) {
  return useQuery(["geo-code", location], () => getGeoCode(location), {
    enabled: !!location && geoLocationEnable,
  });
}
