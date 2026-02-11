-- ============================================================
-- Migración correctiva: arreglar profiles + seed ingredients
-- Ejecutar en: Supabase → SQL Editor → Run
-- ============================================================

-- 1. Corregir tabla profiles (agregar columnas faltantes)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists avatar_url text;

-- Si la columna email existe y no debería, la renombramos/ignoramos
-- (email ya está en auth.users, no necesitamos duplicarla aquí)

-- 2. Habilitar RLS en todas las tablas
alter table public.profiles        enable row level security;
alter table public.devices         enable row level security;
alter table public.ingredients     enable row level security;
alter table public.orders          enable row level security;
alter table public.order_ingredients enable row level security;

-- 3. Políticas para profiles
drop policy if exists "Usuarios ven su propio perfil"       on public.profiles;
drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Políticas para devices
drop policy if exists "Usuarios gestionan sus propios dispositivos" on public.devices;

create policy "Usuarios gestionan sus propios dispositivos"
  on public.devices for all
  using (auth.uid() = user_id);

-- 5. Ingredientes visibles para todos
drop policy if exists "Ingredientes visibles para todos" on public.ingredients;

create policy "Ingredientes visibles para todos"
  on public.ingredients for select
  using (true);

-- 6. Políticas para orders
drop policy if exists "Usuarios ven sus propios pedidos"   on public.orders;
drop policy if exists "Usuarios crean sus propios pedidos" on public.orders;
drop policy if exists "Service role actualiza pedidos"     on public.orders;

create policy "Usuarios ven sus propios pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Usuarios crean sus propios pedidos"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Service role actualiza pedidos"
  on public.orders for update
  using (true);

-- 7. Políticas para order_ingredients
drop policy if exists "Usuarios ven ingredientes de sus pedidos"     on public.order_ingredients;
drop policy if exists "Usuarios insertan ingredientes en sus pedidos" on public.order_ingredients;

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

-- 8. Trigger para crear perfil automáticamente al registrarse
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

-- 9. Seed de ingredientes (solo si está vacía)
insert into public.ingredients (name, emoji, category, display_order)
select * from (values
  ('Pan inferior', '🍞', 'base',    1),
  ('Carne',        '🥩', 'protein', 2),
  ('Queso',        '🧀', 'cheese',  3),
  ('Lechuga',      '🥬', 'veggie',  4),
  ('Tomate',       '🍅', 'veggie',  5),
  ('Cebolla',      '🧅', 'veggie',  6),
  ('Pepino',       '🥒', 'veggie',  7),
  ('Bacon',        '🥓', 'protein', 8),
  ('Salsa BBQ',    '🫙', 'sauce',   9),
  ('Pan superior', '🍞', 'base',   10)
) as v(name, emoji, category, display_order)
where not exists (select 1 from public.ingredients limit 1);
