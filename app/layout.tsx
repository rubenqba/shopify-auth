import './globals.css'

export const metadata = {
  title: 'Integración Shopify Demo',
  description: 'Demo de integración con Shopify'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
