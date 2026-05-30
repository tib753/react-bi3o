import cookie from "js-cookie";
import { getGuestId, getToken } from "helper-functions/getToken";
import { updateDestinationLocations } from "components/home/module-wise-components/rental/components/utils/bookingHepler";

export const formattedDate= (dateValue) => {
  const date = new Date(dateValue);
  // Use local time components directly instead of converting to UTC
  const pad = (num) => num.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};


export const bookingConfirm = ({
  id,
  locations,
  searchKey1,
  searchKey2,
  tripType,
  durationValue,
  dateValue,
  data,
  confirmMutate,
  dispatch,
  setCartList,
  toast,
  handleClose,
  onErrorResponse,
  t,
}) => {
  // 2025-01-22 03:48:00 PM
  const userDate = new Date(dateValue);
  const pickupName =
    searchKey1 ||
    (locations?.pickup?.lat
      ? `${locations?.pickup?.lat?.toFixed(5)}, ${locations?.pickup?.lng?.toFixed(5)}`
      : "");
  const destinationName =
    searchKey2 ||
    (locations?.destination?.lat
      ? `${locations?.destination?.lat?.toFixed(5)}, ${locations?.destination?.lng?.toFixed(5)}`
      : "");
  const cartObject = {
    vehicle_id: id,
    quantity: 1,
    pickup_location: { ...locations?.pickup, location_name: pickupName },
    destination_location: {
      ...locations?.destination,
      location_name: destinationName,
    },
    rental_type: tripType,
    estimated_hours: tripType==="day_wise"?durationValue*24:durationValue,
    pickup_time: formattedDate(userDate),
    destination_time:
      (data?.destination_time) ||
      (Number(String(data?.duration || '').replace('s', '')) / 3600) ||
      (Math.floor((data?.rows?.[0]?.elements?.[0]?.duration?.value || 0)) / 3600) ||
      0,
    distance:
      data?.distance ||
      (Math.floor(data?.distanceMeters) / 1000) ||
      ((data?.rows?.[0]?.elements?.[0]?.distance?.value || 0) / 1000) ||
      0,
    guest_id: getToken() ? null : getGuestId(),
  };

  confirmMutate(cartObject, {
    onSuccess: (res) => {
      if (res) {

        dispatch(setCartList(res));
        updateDestinationLocations({
          latitude: res.user_data?.destination_location?.lat,
          longitude: res.user_data?.destination_location?.lng,
          location_name: searchKey2,
        });
        cookie.set("cart-list", res?.carts?.length);
        toast.success(t("The vehicle successfully added to your cart."));
        handleClose?.();
      }
    },
    onError: onErrorResponse,
  });
};
