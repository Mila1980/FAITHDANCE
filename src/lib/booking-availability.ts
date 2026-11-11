export type BookingDate = {
  mode: "zoom" | "in-person";
  label: string;
  date: string;
  hours: string;
  times: string[];
  bookedTimes: string[];
};

function halfHours(start: number, end: number) {
  const values: string[] = [];
  for (let minutes = start; minutes < end; minutes += 30) {
    const hour24 = Math.floor(minutes / 60);
    const hour = hour24 % 12 || 12;
    values.push(`${hour}:${String(minutes % 60).padStart(2, "0")} ${hour24 >= 12 ? "PM" : "AM"}`);
  }
  return values;
}

export function bookingSlotKey(date: string, time: string) {
  const [clock, meridiem] = time.split(" ");
  const [hourText, minute] = clock.split(":");
  let hour = Number(hourText);
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${date}T${String(hour).padStart(2, "0")}:${minute}`;
}

export function areConsecutiveBookingSlots(keys: string[]) {
  return keys.every((key, index) => {
    if (index === 0) return true;
    const previous = keys[index - 1];
    const [date, clock] = previous.split("T");
    const [hour, minute] = clock.split(":").map(Number);
    const nextMinutes = hour * 60 + minute + 30;
    const nextKey = `${date}T${String(Math.floor(nextMinutes / 60)).padStart(2, "0")}:${String(nextMinutes % 60).padStart(2, "0")}`;
    return key === nextKey;
  });
}

export const bookingAvailability: BookingDate[] = [
  { label: "Sunday, November 15, 2026", date: "2026-11-15", mode: "zoom", hours: "9:00 AM–2:00 PM, 3:00–7:00 PM", times: [...halfHours(9 * 60, 14 * 60), ...halfHours(15 * 60, 19 * 60)], bookedTimes: [] },
  { label: "Sunday, November 22, 2026", date: "2026-11-22", mode: "zoom", hours: "1:30–2:00 PM, 3:00–7:00 PM", times: [...halfHours(13 * 60 + 30, 14 * 60), ...halfHours(15 * 60, 19 * 60)], bookedTimes: [] },
  { label: "Wednesday, November 25, 2026", date: "2026-11-25", mode: "in-person", hours: "8:00 AM–9:00 PM", times: halfHours(8 * 60, 21 * 60), bookedTimes: ["10:00 AM"] },
  { label: "Thursday, November 26, 2026", date: "2026-11-26", mode: "in-person", hours: "8:00–11:00 AM", times: halfHours(8 * 60, 11 * 60), bookedTimes: ["10:00 AM"] },
  { label: "Saturday, November 28, 2026", date: "2026-11-28", mode: "in-person", hours: "8:00–10:00 AM, 11:00 AM–3:00 PM", times: [...halfHours(8 * 60, 10 * 60), ...halfHours(11 * 60, 15 * 60)], bookedTimes: ["11:00 AM"] },
  { label: "Sunday, November 29, 2026", date: "2026-11-29", mode: "in-person", hours: "9:00–10:00 AM", times: halfHours(9 * 60, 10 * 60), bookedTimes: ["9:00 AM"] },
];

export const validBookingSlotKeys = bookingAvailability.flatMap((day) =>
  day.times.map((time) => bookingSlotKey(day.date, time)),
);

export const unavailableBookingSlotKeys = new Set(
  bookingAvailability.flatMap((day) =>
    day.bookedTimes.map((time) => bookingSlotKey(day.date, time)),
  ),
);
