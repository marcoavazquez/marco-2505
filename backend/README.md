## Getting Started

First, run the development server:

```bash
pnpm dev
```

## Documentación

### POST /snailpay/pay

Endpoint que procesa un depósito mediante la pasarela de pagos SnailPay. Corre en `http://localhost:8000`.

En el deployment de Vercel (services) el backend también queda expuesto públicamente bajo el prefijo `/api` (rewrite `/api/(.*)` en el `vercel.json` de la raíz): `POST /api/snailpay/pay`, `GET /api/health`. La app lo llama internamente por el binding `BACKEND_URL` (sin prefijo).

**Headers**

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |

No requiere autenticación.

**Cuerpo de la petición**

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `cardNumber` | string | Exactamente 16 caracteres |
| `expirationDate` | string | Formato `MM/YY` (ej: `12/26`) |
| `cvv` | string | Exactamente 3 caracteres |
| `transactionAmount` | number | Positivo (mayor a 0) |
| `playerId` | string | No vacío |
| `playerEmail` | string | Email válido |

**Ejemplo de petición (pago aprobado)**

La única tarjeta válida es `1234123412341234`, `12/26`, `543`:

```bash
curl -X POST http://localhost:8000/snailpay/pay \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "1234123412341234",
    "expirationDate": "12/26",
    "cvv": "543",
    "transactionAmount": 199.99,
    "playerId": "player-int-001",
    "playerEmail": "gamer@example.com"
  }'
```

Respuesta `200 OK`:

```json
{
  "id": "payment-player-int-001-1717000000000",
  "status": "success",
  "status_details": {
    "message": ["Payment processed successfully"],
    "card_number": ["1234123412341234"],
    "cvv": ["543"]
  },
  "authorization_code": "AUTH-123456",
  "transaction_amount": 199.99,
  "reference": "ref-payment-player-int-001-1717000000000",
  "player_id": "player-int-001",
  "player_email": "gamer@example.com",
  "date_created": "2026-10-06T12:00:00.000Z"
}
```

**Ejemplo de petición (pago rechazado)**

Cualquier tarjeta distinta de la válida se rechaza:

```bash
curl -X POST http://localhost:8000/snailpay/pay \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "9999999999999999",
    "expirationDate": "01/30",
    "cvv": "000",
    "transactionAmount": 50,
    "playerId": "player-int-001",
    "playerEmail": "gamer@example.com"
  }'
```

Respuesta `400 Bad Request`:

```json
{
  "id": "payment-player-int-001-1717000000000",
  "status": "rejected",
  "status_details": {
    "message": ["The payment was rejected"]
  },
  "authorization_code": null,
  "transaction_amount": 50,
  "reference": "ref-payment-player-int-001-1717000000000",
  "player_id": "player-int-001",
  "player_email": "gamer@example.com",
  "date_created": "2026-10-06T12:00:00.000Z"
}
```

Si el cuerpo no cumple el esquema (ej: `cardNumber` con menos de 16 caracteres), también responde `400` pero con `status_details` como lista de errores por campo:

```json
{
  "status": "rejected",
  "status_details": [
    { "field": "cardNumber", "message": "Invalid input: too short, expected 16 characters" }
  ]
}
```

### Modo de falla (fail mode)

El middleware `chaos` (`src/middlewares/chaos.ts`) intercepta **todas** las peticiones antes de que lleguen a las rutas y responde `503 Service Unavailable` con `"status": "error"`. Hay dos formas de activarlo:

**1. Por petición: header `x-fail` (no reinicia el servidor)**

```bash
curl -X POST http://localhost:8000/snailpay/pay \
  -H "Content-Type: application/json" \
  -H "x-fail: true" \
  -d '{
    "cardNumber": "1234123412341234",
    "expirationDate": "12/26",
    "cvv": "543",
    "transactionAmount": 199.99,
    "playerId": "player-int-001",
    "playerEmail": "gamer@example.com"
  }'
```

Respuesta `503 Service Unavailable`:

```json
{
  "id": "payment-unknown-1717000000000",
  "status": "error",
  "authorization_code": null,
  "transaction_amount": null,
  "reference": null,
  "player_id": null,
  "player_email": null,
  "date_created": "2026-10-06T12:00:00.000Z"
}
```

**2. Para todo el servidor: variable de entorno `CHAOS`**

En `backend/.env`:

```bash
CHAOS=true
```

Reinicia el servidor (`pnpm dev`). Mientras `CHAOS=true`, **todas** las peticiones (incluido `GET /health`) responderán `503`, sin necesidad del header. Para desactivarlo, volvé a `CHAOS=false` y reiniciá.

