import React from "react";
import { useSelector } from "react-redux";
import dayjs from "utils/dateUtils";

const CustomFormatedDateTime = ({ date }) => {
  const { configData } = useSelector((state) => state.configData);
  let timeFormat = configData?.timeformat;

  if (timeFormat === "12") {
    return dayjs(date).format("ll hh:mm a");
  } else {
    return dayjs(date).format("ll HH:mm");
  }
};

export default CustomFormatedDateTime;
