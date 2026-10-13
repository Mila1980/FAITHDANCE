export type BookingDate = {
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
  {
    label: "Thursday, October 15, 2026",
    date: "2026-10-15",
    hours: "10:00 AM–5:00 PM (11:00 AM–12:00 PM unavailable)",
    times: halfHours(10 * 60, 17 * 60),
    bookedTimes: ["11:00 AM", "11:30 AM"],
  },
  {
    label: "Friday, October 16, 2026",
    date: "2026-10-16",
    hours: "9:00–11:00 AM and 3:00–5:30 PM",
    times: [...halfHours(9 * 60, 11 * 60), ...halfHours(15 * 60, 17 * 60 + 30)],
    bookedTimes: [],
  },
  {
    label: "Saturday, October 17, 2026",
    date: "2026-10-17",
    hours: "10:00 AM–5:00 PM",
    times: halfHours(10 * 60, 17 * 60),
    bookedTimes: [],
  },
  {
    label: "Sunday, October 18, 2026",
    date: "2026-10-18",
    hours: "2:00–4:00 PM",
    times: halfHours(14 * 60, 16 * 60),
    bookedTimes: [],
  },
];

export const validBookingSlotKeys = bookingAvailability.flatMap((day) =>
  day.times.map((time) => bookingSlotKey(day.date, time)),
);

export const unavailableBookingSlotKeys = new Set(
  bookingAvailability.flatMap((day) =>
    day.bookedTimes.map((time) => bookingSlotKey(day.date, time)),
  ),
);
