# Shopify Auth Integration App

Esta aplicación Next.js permite a los usuarios instalar tu aplicación de Shopify de manera segura siguiendo el flujo OAuth estándar de Shopify.

## Flujo de Integración

1. **Inicio**: El usuario introduce la URL de su tienda Shopify (ej: `mi-tienda.myshopify.com`)
2. **Redirect Directo**: La aplicación redirige directamente a `/api/webhooks/shopify/install` con query parameters
3. **Proxy Transparente**: Next.js redirige automáticamente el request a tu API local
4. **OAuth Flow**: Tu API maneja el flujo OAuth y redirige a Shopify para autorización
5. **Autorización**: El usuario autoriza la instalación en Shopify
6. **Callback**: Shopify redirige de vuelta a tu API con el código de autorización
7. **Finalización**: Tu API procesa la autorización y redirige al usuario de vuelta a esta aplicación
8. **Confirmación**: La aplicación detecta el retorno exitoso y muestra la confirmación

## Arquitectura

```
Frontend → Direct Redirect → Next.js Proxy → Local API → Shopify OAuth → Callback → Frontend
```

Esta arquitectura usa redirect directo del navegador, eliminando la complejidad de manejar fetch y redirects manuales.

## Configuración de API

### Proxy de Next.js

La aplicación usa el sistema de proxy integrado de Next.js configurado en `next.config.ts`:

```typescript
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
  ];
}
```

### Request del Frontend

El frontend hace un redirect directo del navegador:

```javascript
const installUrl = `/api/webhooks/shopify/install?shop=mi-tienda.myshopify.com&assistant=02020202020202&redirect_url=http://localhost:3000`;
window.location.href = installUrl;
```

### Query Parameters enviados a tu API

```typescript
{
  shop: string;        // URL de la tienda (ej: "mi-tienda.myshopify.com")
  assistant: string;   // ID del asistente (ej: "02020202020202")
  returnUrl: string;   // URL donde regresar después de la instalación
}
```

### Comportamiento esperado

El endpoint debe procesar la solicitud y devolver un **redirect HTTP (302)** a la página de autorización de Shopify. La aplicación frontend captura este redirect y navega manualmente usando el header `Location` de la respuesta.

Alternativamente, el endpoint puede devolver un JSON con la URL:

```json
{
  "redirectUrl": "https://tienda.myshopify.com/admin/oauth/authorize?..."
}
```

### Ventajas del Redirect Directo

- **Más simple**: No necesita manejar fetch ni redirects manuales
- **Estándar OAuth**: Comportamiento típico de flows OAuth
- **Sin complejidad**: El navegador maneja automáticamente toda la navegación
- **Mejor UX**: Transición más fluida para el usuario
- **Compatible con Shopify**: Funciona perfectamente con el flujo estándar de Shopify
- **Sin problemas de CORS**: Next.js proxy maneja automáticamente los headers

## Detección de Retorno

La aplicación detecta automáticamente cuando el usuario regresa de Shopify verificando los parámetros de URL:

- `shop`: Nombre de la tienda
- `code`: Código de autorización de Shopify
- `error`: Si hubo algún error durante la autorización

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Ejecutar en producción
pnpm start
```

## Tecnologías

- **Next.js 15+**: Framework de React
- **Tailwind CSS**: Estilos
- **TypeScript**: Tipado estático

## Funcionalidades

- ✅ Interfaz idéntica al diseño original HTML
- ✅ Validación de URL de tienda Shopify
- ✅ Integración con API backend
- ✅ Manejo de estados de carga
- ✅ Detección automática de retorno exitoso
- ✅ Manejo de errores
- ✅ Responsive design
- ✅ Accesibilidad (a11y)
