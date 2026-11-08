import MainApi from "../../../MainApi";
import { suggested_items_stores } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (name) => {
  const { data } = await MainApi.get(
    `${suggested_items_stores}?name=${encodeURIComponent(String(name || "").trim())}`
  );
  return data;
};

export default function useGetItemOrStore(name, enabled) {
  const cleaned = String(name || "").trim();
  return useQuery(["item-and-store-suggestions", cleaned], () => getData(cleaned), {
    enabled: !!enabled && cleaned.length > 0,
    onError: onSingleErrorResponse,
    keepPreviousData: true,
  });
}
