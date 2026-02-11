-- ============================================================
-- Fix RLS: ingredientes accesibles sin autenticación
--          y pedidos accesibles con usuario autenticado
-- ============================================================

-- Dar acceso al rol anon para leer ingredientes (es un catálogo público)
grant select on public.ingredients to anon, authenticated;

-- Dar acceso al rol authenticated para operar pedidos
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_ingredients to authenticated;
grant select, insert, update on public.devices to authenticated;
grant select, update on public.profiles to authenticated;

-- Recrear política de ingredientes para incluir el rol anon
drop policy if exists "Ingredientes visibles para todos" on public.ingredients;
create policy "Ingredientes visibles para todos"
  on public.ingredients for select
  to anon, authenticated
  using (true);

-- Asegurarse que orders permite insert a authenticated
drop policy if exists "Usuarios crean sus propios pedidos" on public.orders;
create policy "Usuarios crean sus propios pedidos"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Asegurarse que order_ingredients permite insert a authenticated
drop policy if exists "Usuarios insertan ingredientes en sus pedidos" on public.order_ingredients;
create policy "Usuarios insertan ingredientes en sus pedidos"
  on public.order_ingredients for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
