// Tipos generados a partir del esquema de Supabase
// Actualizar con: npx supabase gen types typescript --project-id TU_ID > src/lib/core/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          push_token: string;
          platform: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          push_token: string;
          platform: string;
          created_at?: string;
        };
        Update: {
          push_token?: string;
          platform?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          category: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          category: string;
          display_order?: number;
        };
        Update: {
          name?: string;
          emoji?: string;
          category?: string;
          display_order?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'preparing' | 'ready' | 'delivered';
          created_at: string;
          notified_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'preparing' | 'ready' | 'delivered';
          created_at?: string;
          notified_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'preparing' | 'ready' | 'delivered';
          notified_at?: string | null;
        };
      };
      order_ingredients: {
        Row: {
          id: string;
          order_id: string;
          ingredient_id: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          ingredient_id: string;
        };
        Update: Record<string, never>;
      };
    };
    Functions: Record<string, never>;
    Enums: {
      order_status: 'pending' | 'preparing' | 'ready' | 'delivered';
    };
  };
}
