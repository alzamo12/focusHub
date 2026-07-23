import { parseTimeString } from "./parseTimeString";

export default function combineDateTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const { hour, min } = parseTimeString(timeStr);

    date.setHours(hour, min, 0, 0)
    return date;
};