-- ============================================================
-- Fix tabla orders: reemplazar enum por text (más compatible)
-- ============================================================

-- Eliminar tabla dependiente primero
drop table if exists public.order_ingredients cascade;
drop table if exists public.orders cascade;

-- Eliminar el tipo enum si existe
drop type if exists public.order_status cascade;

-- Recrear orders con status como TEXT (sin enum, evita conflictos)
create table public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  status       text not null default 'pending'
                 check (status in ('pending','preparing','ready','delivered')),
  created_at   timestamptz default now() not null,
  notified_at  timestamptz
);

-- Recrear order_ingredients
create table public.order_ingredients (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id)
);

-- Habilitar RLS
alter table public.orders           enable row level security;
alter table public.order_ingredients enable row level security;

-- Permisos
grant select, insert, update on public.orders           to authenticated;
grant select, insert          on public.order_ingredients to authenticated;

-- Políticas orders
create policy "select_own_orders"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

create policy "insert_own_orders"
  on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

create policy "update_orders"
  on public.orders for update
  using (true);

-- Políticas order_ingredients
create policy "select_own_order_ingredients"
  on public.order_ingredients for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "insert_own_order_ingredients"
  on public.order_ingredients for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
