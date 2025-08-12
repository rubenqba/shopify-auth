# Shopify Auth Configuration

Aplicación Next.js 15+ para probar la integración de la API con Shopify usando Server Actions.

## 🚀 Tecnologías

- **Next.js 15.4.5** con React 19
- **Tailwind CSS v4** para styling
- **TypeScript** para type safety
- **Server Actions** para comunicación segura servidor-a-servidor

## 📋 Funcionalidades

- ✅ Interfaz de usuario idéntica al HTML original
- ✅ Validación de URL de tienda Shopify en tiempo real
- ✅ Detección automática de retorno desde OAuth
- ✅ Server Actions para evitar problemas de CORS
- ✅ Manejo seguro de redirects con Next.js
- ✅ Estados de carga y mensajes de error

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🏗️ Arquitectura

### Server Actions

La aplicación utiliza Next.js Server Actions para manejar la comunicación con la API de manera segura:

```typescript
// src/app/actions/shopify-install.ts
export async function installShopifyIntegration(formData: FormData) {
  // Comunicación servidor-a-servidor
  // Evita problemas de CORS
  // Redirección segura con Next.js redirect()
}
```

### Flujo de OAuth

1. **Formulario de instalación**: Usuario ingresa la URL de su tienda
2. **Validación client-side**: Verifica formato `.myshopify.com`
3. **Server Action**: Envía POST request a la API
4. **Redirección**: Redirect automático a Shopify para autorización
5. **Callback**: Shopify regresa con código de autorización
6. **Confirmación**: UI muestra éxito o error

### Componentes Principales

- **`ShopifyAuthConfig.tsx`**: Componente principal con formulario y validación
- **`shopify-install.ts`**: Server Action para comunicación con API
- **`page.tsx`**: Página principal que renderiza el componente

## 🔗 API Endpoint

La aplicación se conecta a:

```
POST https://qbamacbook-pro.tail571a1b.ts.net/api/business/{assistant}/integrations/shopify
```

Con payload:

```json
{
  "shop": "tienda.myshopify.com",
  "redirect_url": "http://localhost:3000"
}
```

## 🔄 Estados de la UI

- **Deshabilitada**: Toggle off, sin formulario visible
- **Habilitada**: Toggle on, formulario visible
- **Validando**: Verificación de URL en tiempo real
- **Cargando**: Estado durante la instalación
- **Éxito**: Instalación completada
- **Error**: Mensajes de error específicos
- **OAuth Return**: Detección automática de retorno desde Shopify

## 🛠️ Desarrollo

### Estructura de archivos

```
src/
  app/
    actions/
      shopify-install.ts    # Server Action
    components/
      ShopifyAuthConfig.tsx # Componente principal
    page.tsx               # Página principal
    layout.tsx            # Layout de la app
    globals.css           # Estilos globales
```

### Variables de entorno

No se requieren variables de entorno para desarrollo local.

### Testing

Para probar la integración completa:

1. Ejecutar `npm run dev`
2. Abrir `http://localhost:3000`
3. Habilitar la integración
4. Ingresar una URL válida de Shopify
5. Hacer clic en "Instalar Integración"
6. Verificar el redirect a Shopify

## 🔧 Solución de problemas

### CORS Issues

✅ **Solucionado**: Los Server Actions ejecutan la comunicación servidor-a-servidor, evitando completamente los problemas de CORS.

### Redirect Handling

✅ **Solucionado**: Next.js `redirect()` maneja las redirecciones de manera nativa y segura.

### Fetch Limitations

✅ **Solucionado**: Al usar Server Actions, no dependemos de `fetch()` del cliente que no sigue redirects 302 automáticamente.

## 📝 Notas

- La aplicación usa un assistant ID hardcodeado (`02020202020202`) para desarrollo
- El endpoint de la API debe estar disponible y retornar `{ installUrl: "..." }`
- Los errores de la API se muestran al usuario de manera amigable
- La URL de callback se genera automáticamente basada en la URL actual
