export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: 'base' | 'protein' | 'cheese' | 'veggie' | 'sauce';
  display_order: number;
}

export interface IngredientState extends Ingredient {
  selected: boolean;
}
