export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          created_at: string;
          notified_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          created_at?: string;
          notified_at?: string | null;
        };
        Update: {
          status?: string;
          notified_at?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: 'pending' | 'preparing' | 'ready' | 'delivered';
    };
    CompositeTypes: Record<string, never>;
  };
};
