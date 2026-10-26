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
    label: "Friday, October 30, 2026",
    date: "2026-10-30",
    hours: "4:00–5:30 PM",
    times: halfHours(16 * 60, 17 * 60 + 30),
    bookedTimes: [],
  },
  {
    label: "Saturday, October 31, 2026",
    date: "2026-10-31",
    hours: "11:00 AM–5:00 PM",
    times: halfHours(11 * 60, 17 * 60),
    bookedTimes: [],
  },
  {
    label: "Sunday, November 1, 2026",
    date: "2026-11-01",
    hours: "3:00–7:00 PM",
    times: halfHours(15 * 60, 19 * 60),
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
