import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface OrderPayload {
  order_id: string;
  user_id: string;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default';
  channelId?: string;
}

serve(async (req: Request) => {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const payload: OrderPayload = await req.json();
  const { order_id, user_id } = payload;

  // Esperar 15 segundos antes de notificar
  await new Promise((resolve) => setTimeout(resolve, 15_000));

  // Obtener todos los push tokens del usuario
  const { data: devices, error: devicesError } = await supabase
    .from('devices')
    .select('push_token')
    .eq('user_id', user_id);

  if (devicesError || !devices?.length) {
    console.error('Sin dispositivos registrados para el usuario:', user_id);
    return new Response(JSON.stringify({ error: 'No devices found' }), { status: 404 });
  }

  // Construir mensajes para cada dispositivo
  const messages: ExpoPushMessage[] = devices.map(({ push_token }) => ({
    to: push_token,
    title: '🍔 ¡Tu burger está lista!',
    body: 'Pasá a buscarla, ya está calientita.',
    data: { order_id },
    sound: 'default',
    channelId: 'pedidos',
  }));

  // Enviar notificaciones a Expo Push Service
  const expoResponse = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(messages),
  });

  const expoResult = await expoResponse.json();

  // Marcar el pedido como listo y registrar la hora de notificación
  await supabase
    .from('orders')
    .update({ status: 'ready', notified_at: new Date().toISOString() })
    .eq('id', order_id);

  return new Response(JSON.stringify({ success: true, expo: expoResult }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
