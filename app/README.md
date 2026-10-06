## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentación

### Configuración

La app se comunica con el backend de SnailPay a través del binding de servicio `BACKEND_URL`, declarado en el `vercel.json` de la raíz del repo. Vercel lo inyecta en las funciones del servicio `app` (en producción y con `vercel dev`). Para correr `pnpm dev` suelto, definalo en `.env.local`:

```bash
BACKEND_URL=http://localhost:8000
```

Si no está definida, los depósitos fallan con el mensaje *"La pasarela de pagos no está configurada"*.

El binding solo resuelve en tiempo de ejecución dentro de funciones: no sirve en el build ni en middleware, por eso la llamada se hace desde la server action `src/features/balance/services/snailpay.server.ts`.

### Flujo de depósito

1. Desde el dashboard, botón **"Depositar saldo"** → se abre el diálogo con el formulario (`src/features/balance/components/DepositForm.tsx`).
2. El formulario se valida con Zod (`src/features/balance/dtos/deposit.dto.ts`).
3. El servicio llama a la server action `snailPay` (`src/features/balance/services/snailpay.server.ts`), que ejecuta `POST ${BACKEND_URL}/snailpay/pay` **desde el servidor** con los datos de la tarjeta más `playerId` y `playerEmail` de la sesión (`src/features/balance/services/deposit.service.ts`).
4. Si el backend responde `200`, se actualiza el saldo en `localStorage` y se registra el depósito.

Para probarlo, usá la tarjeta válida del backend: `1234123412341234`, vencimiento `12/26`, CVV `543`.

### Cómo activar el modo de falla (fail mode)

La app no tiene un interruptor en la UI: se activa con un **parámetro de query en la URL**. Cuando la página tiene `?fail=true`, cada petición de depósito agrega el header `x-fail: true`, que el backend interpreta devolviendo `503`.

1. Abrí el dashboard con el parámetro en la URL:

   ```
   http://localhost:3000/dashboard?fail=true
   ```

2. Hacé un depósito normal desde el diálogo. El request saldrá con el header:

   ```
   x-fail: true
   ```

3. El backend responderá `503` y el formulario mostrará el error del depósito.

Notas:

- El valor debe ser exactamente `true` (`?fail=1` o `?fail=False` no activan el modo).
- Se lee en el momento de enviar el formulario; no hay estado persistido. Sacá el parámetro de la URL para volver a la normalidad.
- Comportamiento cubierto por los tests en `src/tests/deposit.form.test.tsx`.

**Alternativa del backend:** también se puede forzar el fallo en **todas** las peticiones del servidor (sin header) seteando `CHAOS=true` en `backend/.env` y reiniciando la API. Ver la documentación de `backend/README.md`.

