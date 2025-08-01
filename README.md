# Shopify Auth Integration App

Esta aplicación Next.js permite a los usuarios instalar tu aplicación de Shopify de manera segura siguiendo el flujo OAuth estándar de Shopify.

## Flujo de Integración

1. **Inicio**: El usuario introduce la URL de su tienda Shopify (ej: `mi-tienda.myshopify.com`)
2. **Solicitud GET**: La aplicación envía un GET a `/api/webhooks/shopify/install` con query parameters
3. **Proxy Transparente**: Next.js redirige automáticamente el request a tu API local
4. **Redirect**: Tu API devuelve un redirect HTTP (302) que es capturado por el frontend
5. **Navegación**: El frontend redirige al usuario a Shopify para autorizar la instalación
6. **Callback**: Shopify redirige de vuelta a tu API con el código de autorización
7. **Finalización**: Tu API procesa la autorización y redirige al usuario de vuelta a esta aplicación
8. **Confirmación**: La aplicación detecta el retorno exitoso y muestra la confirmación

## Arquitectura

```
Frontend → Next.js Proxy → Local API → Shopify OAuth → Callback → Frontend
```

Esta arquitectura usa el sistema de proxy integrado de Next.js hacia tu API local en localhost:8000.

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

El frontend hace GET a la ruta local que es proxificada:

```
GET /api/webhooks/shopify/install?shop=mi-tienda.myshopify.com&assistant=02020202020202&returnUrl=http://localhost:3000
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

### Ventajas del Proxy con GET

- **Estándar OAuth**: GET es el método típico para endpoints de instalación de Shopify
- **Sin configuración CORS**: Next.js maneja automáticamente los headers
- **Query parameters**: Más natural para este tipo de requests
- **Transparente**: Tu API recibe el request como si viniera directamente del navegador
- **Compatible con Shopify SDK**: El SDK puede verificar la autenticidad del request
- **Cacheable**: Los requests GET pueden ser cacheados por navegadores/proxies si es necesario

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
