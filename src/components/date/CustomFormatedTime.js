import { useSelector } from "react-redux";
import dayjs from "utils/dateUtils";

const CustomFormatedTime = ({ date }) => {
  const { configData } = useSelector((state) => state.configData);
  let timeFormat = configData?.timeformat;
  if (timeFormat === "12") {
    return dayjs(date).format("hh:mm a");
  } else {
    return dayjs(date).format("HH:mm");
  }
};

export default CustomFormatedTime;
