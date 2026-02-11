export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  created_at: string;
  notified_at: string | null;
}
