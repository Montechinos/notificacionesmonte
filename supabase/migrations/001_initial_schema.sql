-- ============================================================
-- BurgerMonte – Esquema inicial de base de datos
-- ============================================================

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- TABLA: profiles
-- Se crea automáticamente al registrarse un usuario
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- TABLA: devices (push tokens)
-- ────────────────────────────────────────────────────────────
create table public.devices (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  push_token  text not null,
  platform    text not null check (platform in ('ios', 'android', 'web')),
  created_at  timestamptz default now() not null,
  unique (user_id, push_token)
);

alter table public.devices enable row level security;

create policy "Usuarios gestionan sus propios dispositivos"
  on public.devices for all
  using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- TABLA: ingredients
-- ────────────────────────────────────────────────────────────
create table public.ingredients (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  emoji         text not null,
  category      text not null check (category in ('base','protein','cheese','veggie','sauce')),
  display_order integer default 0 not null
);

alter table public.ingredients enable row level security;

create policy "Ingredientes visibles para todos"
  on public.ingredients for select
  using (true);

-- Datos iniciales de ingredientes
insert into public.ingredients (name, emoji, category, display_order) values
  ('Pan inferior', '🍞', 'base',    1),
  ('Carne',        '🥩', 'protein', 2),
  ('Queso',        '🧀', 'cheese',  3),
  ('Lechuga',      '🥬', 'veggie',  4),
  ('Tomate',       '🍅', 'veggie',  5),
  ('Cebolla',      '🧅', 'veggie',  6),
  ('Pepino',       '🥒', 'veggie',  7),
  ('Bacon',        '🥓', 'protein', 8),
  ('Salsa BBQ',    '🫙', 'sauce',   9),
  ('Pan superior', '🍞', 'base',   10);


-- ────────────────────────────────────────────────────────────
-- TABLA: orders
-- ────────────────────────────────────────────────────────────
create type public.order_status as enum ('pending', 'preparing', 'ready', 'delivered');

create table public.orders (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  status       public.order_status default 'pending' not null,
  created_at   timestamptz default now() not null,
  notified_at  timestamptz
);

alter table public.orders enable row level security;

create policy "Usuarios ven sus propios pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Usuarios crean sus propios pedidos"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Service role actualiza pedidos"
  on public.orders for update
  using (true);


-- ────────────────────────────────────────────────────────────
-- TABLA: order_ingredients
-- ────────────────────────────────────────────────────────────
create table public.order_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id)
);

alter table public.order_ingredients enable row level security;

create policy "Usuarios ven ingredientes de sus pedidos"
  on public.order_ingredients for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Usuarios insertan ingredientes en sus pedidos"
  on public.order_ingredients for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );


-- ────────────────────────────────────────────────────────────
-- TRIGGER: disparar Edge Function al insertar un pedido
-- ────────────────────────────────────────────────────────────
create or replace function public.trigger_notify_order()
returns trigger language plpgsql security definer as $$
begin
  -- Invocar la Edge Function de forma asíncrona usando pg_net (si está disponible)
  -- Alternativa: usar Supabase Webhooks desde el dashboard
  perform
    net.http_post(
      url := current_setting('app.edge_function_url') || '/notify-order-ready',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := jsonb_build_object('order_id', new.id, 'user_id', new.user_id)
    );
  return new;
end;
$$;

create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.trigger_notify_order();
