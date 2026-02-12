import { useState, useCallback } from 'react';
import { ordersService } from './orders.service';
import { sendLocalNotification } from '@src/lib/core/notifications';

type OrderState = 'idle' | 'ordering' | 'waiting' | 'done' | 'error';

export function useOrder(userId: string | undefined) {
  const [state, setState] = useState<OrderState>('idle');
  const [countdown, setCountdown] = useState(15);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = useCallback(
    async (ingredientIds: string[]) => {
      if (!userId || ingredientIds.length === 0) return;

      setState('ordering');
      setError(null);

      try {
        await ordersService.createOrder(userId, ingredientIds);
        setState('waiting');

        let remaining = 15;
        setCountdown(remaining);

        const interval = setInterval(() => {
          remaining -= 1;
          setCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(interval);
            setState('done');
            sendLocalNotification(
              '🍔 ¡Tu burger está lista!',
              'Ya puedes pasar a retirar tu pedido. ¡Buen provecho!'
            );
          }
        }, 1000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al realizar el pedido');
        setState('error');
      }
    },
    [userId]
  );

  const reset = useCallback(() => {
    setState('idle');
    setCountdown(15);
    setError(null);
  }, []);

  return { state, countdown, error, placeOrder, reset };
}
