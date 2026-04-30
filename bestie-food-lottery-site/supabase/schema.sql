-- Supabase 数据库结构预留
-- 第一版网站当前使用 localStorage 保存数据。
-- 后续接入 Supabase 时，可以使用以下表结构。

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nickname text,
  created_at timestamptz default now()
);

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null,
  created_at timestamptz default now()
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  email text not null,
  role text default 'member',
  created_at timestamptz default now()
);

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  created_by_email text not null,
  name text not null,
  cuisine text,
  address text not null,
  phone text,
  avg_price numeric,
  image_url text,
  dianping_url text,
  tags text[],
  note text,
  rating int default 5,
  latitude double precision,
  longitude double precision,
  last_visited_at date,
  created_at timestamptz default now()
);

create table if not exists lottery_records (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete set null,
  drawn_by_email text not null,
  created_at timestamptz default now()
);
