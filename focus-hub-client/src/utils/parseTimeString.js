export function parseTimeString(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!match) throw new Error("Invalid time format");

    let [_, hour, min, period] = match;
    hour = parseInt(hour);
    min = parseInt(min);

    if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (period.toLowerCase() === "am" && hour === 12) hour = 0;

    return { hour, min };
}
