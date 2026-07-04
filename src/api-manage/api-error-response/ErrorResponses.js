import toast from "react-hot-toast";
import { t } from "i18next";
import Router from "next/router";

const errorTranslations = {
  descriptive_attrs: "Please select all options before adding to cart",
};

export const handleTokenExpire = (item, status) => {
  if (status === 401) {
    if (window.localStorage.getItem("token")) {
      toast.error(t("Your account is inactive or Your token has been expired"));
      window?.localStorage.removeItem("token");
      Router.push("/home", undefined, { shallow: true });
    }
  } else {
    const key = errorTranslations[item?.code];
    toast.error(key ? t(key) : item?.message, {
      id: "error",
    });
  }
};

export const onErrorResponse = (error) => {
  error?.response?.data?.errors?.forEach((item) => {
    handleTokenExpire(item);
  });
};
export const onSingleErrorResponse = (error) => {
  toast.error(error?.response?.data?.message, {
    id: "error",
  });
  handleTokenExpire(error, error?.response?.status);
};
