import { useSelector } from "react-redux";
import dayjs from "utils/dateUtils";

const CustomTimeFormat = ({ time }) => {
  const { configData } = useSelector((state) => state.configData);
  let timeFormat = configData?.timeformat;
  const myMoment = dayjs(time, "HH:mm:ss");

  if (timeFormat === "12") {
    return myMoment.format("hh:mm a");
  } else {
    return myMoment.format("HH:mm");
  }
};

export default CustomTimeFormat;
