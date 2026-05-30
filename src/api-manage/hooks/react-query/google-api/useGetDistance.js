import { useQuery } from "react-query";
import { distance_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildResponse = (distMeters, durSeconds, origLat, origLng, destLat, destLng) => ({
  destination_addresses: [`${destLat}, ${destLng}`],
  origin_addresses: [`${origLat}, ${origLng}`],
  rows: [
    {
      elements: [
        {
          distance: { value: Math.round(distMeters) },
          duration: { value: Math.round(durSeconds) },
          status: "OK",
        },
      ],
    },
  ],
  distanceMeters: Math.round(distMeters),
  duration: `${Math.round(durSeconds)}s`,
  status: "OK",
});

const getDistance = async (origin, destination, mode) => {
  if (!origin || !destination) return null;

  const origLat = origin?.lat;
  const origLng = origin?.lng;
  const destLat = destination.lat ? destination.lat : destination?.latitude;
  const destLng = destination.lng ? destination.lng : destination?.longitude;

  // 1) Try backend API
  try {
    const { data } = await MainApi.get(
      `${distance_api}?origin_lat=${origLat}&origin_lng=${origLng}&destination_lat=${destLat}&destination_lng=${destLng}&mode=${mode || "DRIVE"}`
    );
    if (data && !data?.error) return data;
  } catch (e) {
    console.log("Backend distance API failed", e?.message);
  }

  // 2) Try client-side Google DistanceMatrixService (uses frontend API key)
  try {
    if (window?.google?.maps?.DistanceMatrixService) {
      const service = new window.google.maps.DistanceMatrixService();
      const result = await new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [{ lat: origLat, lng: origLng }],
            destinations: [{ lat: destLat, lng: destLng }],
            travelMode: google.maps.TravelMode[mode === "WALK" ? "WALKING" : "DRIVING"],
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === "OK" && response?.rows?.[0]?.elements?.[0]?.status === "OK") {
              resolve(response);
            } else {
              reject(new Error(status));
            }
          }
        );
      });
      const el = result.rows[0].elements[0];
      return buildResponse(
        el.distance.value,
        el.duration.value,
        origLat, origLng, destLat, destLng
      );
    }
  } catch (e) {
    console.log("Client Google DistanceMatrix failed", e?.message);
  }

  // 3) Fallback: Haversine straight-line distance
  const km = haversineKm(origLat, origLng, destLat, destLng);
  const distMeters = km * 1000;
  const durSeconds = (km / 40) * 3600; // assume ~40 km/h avg speed
  console.log("Using Haversine fallback:", km.toFixed(2), "km");
  return buildResponse(distMeters, durSeconds, origLat, origLng, destLat, destLng);
};

export default function useGetDistance(origin, destination, mode) {
  return useQuery(
    ["distance", origin, destination],
    () => getDistance(origin, destination, mode),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
