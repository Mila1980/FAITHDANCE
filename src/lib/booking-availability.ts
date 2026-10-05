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

export const bookingAvailability: BookingDate[] = [
  {
    label: "Friday, October 9, 2026",
    date: "2026-10-09",
    hours: "11:30 AM–3:00 PM",
    times: halfHours(11 * 60 + 30, 15 * 60),
    bookedTimes: ["11:30 AM", "12:00 PM", "1:30 PM", "2:00 PM"],
  },
  {
    label: "Monday, October 12, 2026",
    date: "2026-10-12",
    hours: "8:00 AM–12:00 PM",
    times: halfHours(8 * 60, 12 * 60),
    bookedTimes: ["11:00 AM", "11:30 AM"],
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
