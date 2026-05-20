import dayjs from "./dateUtils";

export const currentDate = dayjs().format("YYYY-MM-DD HH:mm");
export const nextday = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");

export const today = dayjs(currentDate).format("dddd");
export const tomorrow = dayjs(nextday).format("dddd");

export const CurrentDatee = dayjs().format();

export const todayTime = dayjs(CurrentDatee).format("HH:mm");
