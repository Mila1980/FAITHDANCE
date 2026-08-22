create table if not exists public.faith_bookings (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), name text not null, email text not null, phone text not null,
  dancer_name text, session_type text not null, notes text, status text not null default 'confirmed'
);
create table if not exists public.faith_booking_slots (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.faith_bookings(id) on delete cascade,
  slot_key text not null unique, slot_label text not null
);
alter table public.faith_bookings enable row level security;
alter table public.faith_booking_slots enable row level security;
