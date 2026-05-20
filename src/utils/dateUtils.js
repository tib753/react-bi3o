import dayjs from "dayjs";
import "dayjs/locale/ar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import duration from "dayjs/plugin/duration";

dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.locale("ar");

export default dayjs;
