import { supabase } from '@src/lib/core/supabase';

export const ordersService = {
  async createOrder(userId: string, ingredientIds: string[]): Promise<string> {
    // 1. Insertar el pedido principal
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, status: 'pending' })
      .select('id')
      .single();

    if (orderError || !order) throw orderError ?? new Error('Error creando pedido');

    // 2. Insertar los ingredientes seleccionados
    const orderIngredients = ingredientIds.map((ingredient_id) => ({
      order_id: order.id,
      ingredient_id,
    }));

    const { error: ingrError } = await supabase
      .from('order_ingredients')
      .insert(orderIngredients);

    if (ingrError) throw ingrError;

    return order.id;
  },

  async getLastOrder(userId: string) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data;
  },
};
