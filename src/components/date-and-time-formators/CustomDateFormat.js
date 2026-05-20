import React from "react";
import dayjs from "utils/dateUtils";

export const CustomDateFormat = (date) => {
  return dayjs(date).format("ll");
};
