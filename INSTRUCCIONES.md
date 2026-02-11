# BurgerMonte — Instrucciones de configuración y despliegue

## 1. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
EXPO_PUBLIC_EAS_PROJECT_ID=TU_PROJECT_ID_EAS
```

---

## 2. Configurar Supabase

### 2.1 Crear el proyecto
1. Ir a [supabase.com](https://supabase.com) → New Project
2. Copiar `Project URL` y `anon public key` al `.env.local`

### 2.2 Ejecutar el SQL
En el **SQL Editor** de Supabase, correr el archivo:
```
supabase/migrations/001_initial_schema.sql
```

### 2.3 Activar pg_net (para el trigger)
En el SQL Editor ejecutar:
```sql
create extension if not exists pg_net;
```
O bien configurar el webhook desde **Database → Webhooks**:
- Tabla: `orders`
- Evento: `INSERT`
- URL: `https://TU_PROYECTO.supabase.co/functions/v1/notify-order-ready`
- Headers: `Authorization: Bearer TU_SERVICE_ROLE_KEY`

---

## 3. Desplegar la Edge Function

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular proyecto
supabase link --project-ref TU_PROJECT_REF

# Desplegar función
supabase functions deploy notify-order-ready --no-verify-jwt
```

---

## 4. Probar notificaciones push

### En emulador (solo prueba básica):
```bash
npx expo start
```

### En dispositivo físico (recomendado):
```bash
npx expo start --tunnel
```

1. Instalar **Expo Go** en el celular
2. Escanear el QR
3. Registrarse con email y contraseña
4. Seleccionar ingredientes y presionar **PEDIR**
5. Esperar 15 segundos → llega la notificación push

---

## 5. Compilar APK con EAS Build

### 5.1 Instalar EAS CLI y autenticarse
```bash
npm install -g eas-cli
eas login
```

### 5.2 Inicializar el proyecto EAS
```bash
eas init
```
Esto genera el `projectId` en Expo. Copiarlo en:
- `app.json → extra.eas.projectId`
- `.env.local → EXPO_PUBLIC_EAS_PROJECT_ID`

### 5.3 Compilar APK (perfil preview)
```bash
eas build --platform android --profile preview
```

### 5.4 Descargar e instalar
Una vez completado el build en la nube de EAS:
1. Ir al dashboard en [expo.dev](https://expo.dev)
2. Descargar el `.apk`
3. Instalar en Android habilitando "fuentes desconocidas"

---

## 6. Estructura del proyecto

```
app/                    ← Rutas de Expo Router
├── (auth)/             ← Login, Register
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/             ← Tabs principales
│   ├── _layout.tsx
│   ├── order.tsx       ← Pantalla de pedido
│   └── profile.tsx     ← Pantalla de perfil
├── _layout.tsx         ← Root layout con AuthProvider
└── index.tsx           ← Redirect inicial

src/
├── components/
│   ├── burger/         ← BurgerPreview, BurgerLayer
│   └── ui/             ← Button, Input, OrderStatus
└── lib/
    ├── core/
    │   ├── supabase/   ← Cliente + tipos
    │   ├── notifications/ ← Permisos + tokens
    │   └── storage/    ← SecureStore
    └── modules/
        ├── auth/       ← AuthContext, authService, useDeviceRegistration
        ├── ingredients/ ← useIngredients, tipos, datos
        └── orders/     ← ordersService, useOrder

supabase/
├── migrations/001_initial_schema.sql
└── functions/notify-order-ready/index.ts
```
