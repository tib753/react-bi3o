import { t } from "i18next";

export const filterTypeItems = [
  // { label: "On Sale", value: "on_sale", checked: false },
  // { label: "Nearby", value: "nearby", checked: false },
  { label: t("Available for Now"), value: "available_now", checked: false },
  { label: t("Discounted"), value: "discounted", checked: false },

  //{ label: "From Campaign", value: "from_campaign", checked: false },
  // {
  //   label: "Popular",
  //   value: "popular",
  //   checked: false,
  // },

  // {
  //   label: "Price",
  //   value: "price",
  //   price: [],
  //   checked: false,
  // },
  // {
  //   label: "Ratings",
  //   value: "ratings",
  //   rating: 0,
  //   checked: false,
  // },
];

export const filterTypeStores = [
  // { label: "On Sale", value: "on_sale", checked: false },

  {
    label: t("Currently Open"),
    value: "currently_open",
    checked: false,
  },
  {
    label: t("Top Rated"),
    value: "top_rated",
    checked: false,
  },
  { label: t("Discounted"), value: "discounted", checked: false },
  // { label: "From Campaign", value: "from_campaign", checked: false },
  {
    label: t("Popular"),
    value: "popular",
    checked: false,
  },
  {
    label: t("Free delivery"),
    value: "free_delivery",
    checked: false,
  },
  {
    label: t("Available for Now"),
    value: "available_now",
    checked: false,
  },
  { label: t("Coupon Applicable Restaurants"), value: "coupon", checked: false },


  // {
  //   label: "Best Seller",
  //   value: "best_seller",
  //   checked: false,
  // },
  // {
  //   label: "Price",
  //   value: "price",
  //   price: [],
  //   checked: true,
  // },
  // {
  //   label: "Ratings",
  //   value: "ratings",
  //   rating: 0,
  //   checked: false,
  // },
];
