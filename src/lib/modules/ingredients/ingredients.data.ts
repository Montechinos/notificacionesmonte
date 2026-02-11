import { Ingredient } from './ingredients.types';

// Ingredientes por defecto (se reemplazan con los de Supabase al cargar)
export const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Pan inferior', emoji: '🍞', category: 'base', display_order: 1 },
  { id: '2', name: 'Carne', emoji: '🥩', category: 'protein', display_order: 2 },
  { id: '3', name: 'Queso', emoji: '🧀', category: 'cheese', display_order: 3 },
  { id: '4', name: 'Lechuga', emoji: '🥬', category: 'veggie', display_order: 4 },
  { id: '5', name: 'Tomate', emoji: '🍅', category: 'veggie', display_order: 5 },
  { id: '6', name: 'Cebolla', emoji: '🧅', category: 'veggie', display_order: 6 },
  { id: '7', name: 'Pepino', emoji: '🥒', category: 'veggie', display_order: 7 },
  { id: '8', name: 'Bacon', emoji: '🥓', category: 'protein', display_order: 8 },
  { id: '9', name: 'Salsa BBQ', emoji: '🫙', category: 'sauce', display_order: 9 },
  { id: '10', name: 'Pan superior', emoji: '🍞', category: 'base', display_order: 10 },
];
