import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/core/supabase';
import { IngredientState } from './ingredients.types';
import { DEFAULT_INGREDIENTS } from './ingredients.data';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<IngredientState[]>(
    DEFAULT_INGREDIENTS.map((i) => ({ ...i, selected: true }))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('display_order');

      if (!error && data?.length) {
        setIngredients(data.map((i) => ({ ...i, selected: true })));
      }
      setIsLoading(false);
    };

    fetchIngredients();
  }, []);

  const toggleIngredient = useCallback((id: string) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    );
  }, []);

  const selectedIngredients = ingredients.filter((i) => i.selected);

  return { ingredients, selectedIngredients, toggleIngredient, isLoading };
}
