import dayjs from "./dateUtils";
export const dateAndTimeConverter = {
  dateWithTime: function (value, time) {
    const formatted12Time = dayjs(value, ["HH:mm"]).format("hh:mm a");
    const formatted24Time = dayjs(value, ["h:mm A"]).format("HH:mm");
    return time === "12" ? formatted12Time : formatted24Time;
  },
};
