"use client"
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [enabled, setEnabled] = useState(false)
  const [storeUrl, setStoreUrl] = useState('')
  const [error, setError] = useState('')
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null)

  const validateStoreUrl = (url: string) => {
    const pattern = /^[a-z0-9-]+\.myshopify\.com$/
    return pattern.test(url)
  }

  useEffect(() => {
    if (!enabled) {
      setStoreUrl('')
      setError('')
      setValid(false)
      setStatus(null)
    }
  }, [enabled])

  useEffect(() => {
    if (!storeUrl) {
      setError('')
      setValid(false)
      return
    }
    if (validateStoreUrl(storeUrl.trim())) {
      setError('')
      setValid(true)
    } else {
      setError('URL inválida. Debe tener formato tu-tienda.myshopify.com')
      setValid(false)
    }
  }, [storeUrl])

  const handleInstall = async () => {
    if (!valid) return
    setLoading(true)
    setStatus({ type: 'info', message: 'Generando URL de instalación...' })
    try {
      const res = await fetch('https://cc63c0a6c4d5.ngrok-free.app/api/webhooks/shopify/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeUrl: storeUrl.trim() })
      })
      const data = await res.json()
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        throw new Error('No se recibió URL de redirección')
      }
    } catch (e: any) {
      setStatus({ type: 'error', message: e.message || 'Error al generar la instalación' })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <a href="#">Configuración</a>
        <span>›</span>
        <a href="#">Mi Asistente</a>
        <span>›</span>
        <span>Integraciones</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Integraciones</h1>
        <p className="text-sm text-gray-500">Conecta tu asistente con servicios externos para ampliar sus funcionalidades</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#95BF47] to-[#7FAA3C] rounded flex items-center justify-center text-white font-bold text-sm">S</div>
            <h3 className="text-lg font-semibold text-gray-800">Shopify</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {enabled ? 'Configurando...' : 'Deshabilitado'}
          </div>
        </div>

        <p className="text-gray-500 mb-6 leading-relaxed">
          Conecta tu tienda Shopify para que tu asistente pueda acceder a tu catálogo de productos, crear órdenes y gestionar inventario en tiempo real desde WhatsApp.
        </p>

        <div className="flex items-center justify-between p-4 bg-gray-100 rounded mb-6">
          <span className="font-medium text-gray-700">Habilitar integración con Shopify</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors" />
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>

        {enabled && (
          <div>
            <div className="mb-5">
              <label htmlFor="storeUrl" className="block font-medium text-gray-700 mb-2">URL de tu tienda Shopify</label>
              <input
                id="storeUrl"
                type="text"
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${error ? 'border-red-500' : valid ? 'border-green-500' : 'border-gray-300'}`}
                placeholder="tu-tienda.myshopify.com"
                value={storeUrl}
                onChange={e => setStoreUrl(e.target.value)}
                autoComplete="off"
              />
              <p className="text-sm text-gray-500 mt-1">Ingresa la URL completa de tu tienda (ejemplo: mi-tienda.myshopify.com)</p>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            {status && (
              <div className={`connection-status ${status.type === 'info' ? '' : status.type === 'success' ? 'success' : 'error'}`}>              
                <div className={`status-icon ${status.type}`}>{status.type === 'info' ? 'i' : status.type === 'success' ? '✓' : '×'}</div>
                <span>{status.message}</span>
              </div>
            )}

            <div>
              <button
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleInstall}
                disabled={!valid || loading}
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                )}
                Instalar Integración
              </button>
            </div>

            <div className="bg-gray-100 rounded p-4 mt-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Funcionalidades incluidas:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center bg-green-500 text-white w-5 h-5 rounded-full text-xs">✓</span>
                  <span className="text-gray-500 text-sm">Sincronización automática del catálogo de productos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center bg-green-500 text-white w-5 h-5 rounded-full text-xs">✓</span>
                  <span className="text-gray-500 text-sm">Consulta de inventario en tiempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center bg-green-500 text-white w-5 h-5 rounded-full text-xs">✓</span>
                  <span className="text-gray-500 text-sm">Creación automática de órdenes borrador</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center bg-green-500 text-white w-5 h-5 rounded-full text-xs">✓</span>
                  <span className="text-gray-500 text-sm">Acceso a información de clientes existentes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center bg-green-500 text-white w-5 h-5 rounded-full text-xs">✓</span>
                  <span className="text-gray-500 text-sm">Generación de enlaces de pago seguros</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
