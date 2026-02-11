-- ============================================================
-- RESET COMPLETO — Ejecutar en Supabase SQL Editor
-- Borra todo y recrea con el esquema correcto
-- ============================================================

-- 1. Limpiar todo
drop table if exists public.order_ingredients cascade;
drop table if exists public.orders          cascade;
drop table if exists public.ingredients     cascade;
drop table if exists public.devices         cascade;
drop table if exists public.profiles        cascade;
drop type  if exists public.order_status    cascade;

-- ────────────────────────────────────────────────────────────
-- 2. PROFILES
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  avatar_url text,
  created_at timestamptz default now() not null
);
alter table public.profiles enable row level security;
grant select, update on public.profiles to authenticated;

create policy "ver_perfil_propio"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "actualizar_perfil_propio"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

-- Trigger: crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 3. DEVICES (push tokens)
-- ────────────────────────────────────────────────────────────
create table public.devices (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  push_token text not null,
  platform   text not null,
  created_at timestamptz default now() not null,
  unique (user_id, push_token)
);
alter table public.devices enable row level security;
grant select, insert, update, delete on public.devices to authenticated;

create policy "gestionar_dispositivos_propios"
  on public.devices for all to authenticated
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 4. INGREDIENTS
-- ────────────────────────────────────────────────────────────
create table public.ingredients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  emoji         text not null,
  category      text not null,
  display_order integer default 0 not null
);
alter table public.ingredients enable row level security;
grant select on public.ingredients to anon, authenticated;

create policy "ingredientes_publicos"
  on public.ingredients for select
  to anon, authenticated
  using (true);

-- Seed de ingredientes
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
-- 5. ORDERS
-- ────────────────────────────────────────────────────────────
create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending'
                check (status in ('pending','preparing','ready','delivered')),
  created_at  timestamptz default now() not null,
  notified_at timestamptz
);
alter table public.orders enable row level security;
grant select, insert, update on public.orders to authenticated;

create policy "ver_pedidos_propios"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

create policy "crear_pedidos_propios"
  on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

create policy "actualizar_pedidos"
  on public.orders for update
  using (true);

-- ────────────────────────────────────────────────────────────
-- 6. ORDER_INGREDIENTS
-- ────────────────────────────────────────────────────────────
create table public.order_ingredients (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id)
);
alter table public.order_ingredients enable row level security;
grant select, insert on public.order_ingredients to authenticated;

create policy "ver_ingredientes_de_pedido_propio"
  on public.order_ingredients for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "insertar_ingredientes_en_pedido_propio"
  on public.order_ingredients for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
