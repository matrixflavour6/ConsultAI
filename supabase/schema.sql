-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  business_name text,
  bio text,
  logo_url text,
  booking_slug text unique,
  timezone text default 'UTC',
  license_status text default 'free', -- free | pro
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  status text default 'lead', -- lead | active | past
  notes text,
  created_at timestamptz default now()
);

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  title text,
  content text,
  status text default 'draft', -- draft | sent | signed
  amount numeric,
  signed_at timestamptz,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  proposal_id uuid references proposals(id) on delete set null,
  amount numeric not null,
  status text default 'draft', -- draft | sent | paid
  stripe_payment_link text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes int default 30,
  notes text,
  created_at timestamptz default now()
);

create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  email text not null,
  gumroad_license_key text unique,
  status text default 'active', -- active | refunded | disputed
  created_at timestamptz default now()
);

-- Row Level Security: every user only ever sees their own rows
alter table users enable row level security;
alter table clients enable row level security;
alter table proposals enable row level security;
alter table invoices enable row level security;
alter table bookings enable row level security;
alter table licenses enable row level security;

create policy "own row" on users for all using (auth.uid() = id);
create policy "own clients" on clients for all using (auth.uid() = user_id);
create policy "own proposals" on proposals for all using (auth.uid() = user_id);
create policy "own invoices" on invoices for all using (auth.uid() = user_id);
create policy "own bookings" on bookings for all using (auth.uid() = user_id);
create policy "own license" on licenses for select using (auth.uid() = user_id);
