"use client";

import { useState, useEffect } from "react";
import { installShopifyIntegration } from "../actions/shopify-install";

export default function ShopifyAuthConfig() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [assistantId, setAssistantId] = useState(
    "asst_HddXQwDnR5Ng4YsZcthtmB9h"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    error?: string;
    success?: string;
  }>({ isValid: false });
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Detectar si el usuario regresa de Shopify después de la instalación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get("shop");
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      setStatus({
        type: "error",
        message: `Error en la instalación: ${error}`,
      });
      // Limpiar URL sin recargar la página
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (shop && code) {
      // El usuario regresó exitosamente de Shopify
      setIsEnabled(true);
      setStoreUrl(shop);
      setValidationState({
        isValid: true,
        success: "Instalación completada exitosamente",
      });
      setStatus({
        type: "success",
        message: `¡Excelente! La integración con ${shop} se instaló correctamente. Tu asistente ya puede acceder a tu tienda.`,
      });

      // Limpiar URL sin recargar la página
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      // Reset form when disabling
      setStoreUrl("");
      setStatus(null);
      setValidationState({ isValid: false });
    }
  };

  const validateStoreUrl = (url: string) => {
    if (!url.trim()) {
      setValidationState({
        isValid: false,
        error: "Por favor ingresa la URL de tu tienda",
      });
      return false;
    }

    if (!url.includes(".myshopify.com")) {
      setValidationState({
        isValid: false,
        error: "URL de tienda inválida. Debe terminar en .myshopify.com",
      });
      return false;
    }

    setValidationState({ isValid: true });
    return true;
  };

  const handleStoreUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreUrl(value);
    setStatus(null);

    // Validación en tiempo real
    if (!value.trim()) {
      setValidationState({ isValid: false });
    } else if (!value.includes(".myshopify.com")) {
      setValidationState({
        isValid: false,
        error: "URL de tienda inválida. Debe terminar en .myshopify.com",
      });
    } else {
      setValidationState({ isValid: true });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateStoreUrl(storeUrl)) {
      e.preventDefault();
      return;
    }

    setIsLoading(true);
    setStatus({
      type: "info",
      message: "Redirigiendo a Shopify para autorizar la instalación...",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans leading-relaxed">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500">
          <a href="#" className="text-blue-600 hover:underline">
            Configuración
          </a>
          <span>›</span>
          <a href="#" className="text-blue-600 hover:underline">
            Mi Asistente
          </a>
          <span>›</span>
          <span>Integraciones</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Integraciones
          </h1>
          <p className="text-slate-600 text-sm">
            Conecta tu asistente con servicios externos para ampliar sus
            funcionalidades
          </p>
        </div>

        {/* Integration Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          {/* Integration Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Shopify
                </h3>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                validationState.success
                  ? "bg-green-100 text-green-800"
                  : isEnabled
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {validationState.success
                ? "Habilitado"
                : isEnabled
                ? "Configurando..."
                : "Deshabilitado"}
            </div>
          </div>

          <p className="text-slate-600 mb-6 leading-relaxed">
            Conecta tu tienda Shopify para que tu asistente pueda acceder a tu
            catálogo de productos, crear órdenes y gestionar inventario en
            tiempo real desde WhatsApp.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-6">
            <label className="font-medium text-slate-700">
              Habilitar integración con Shopify
            </label>
            <button
              type="button"
              onClick={handleToggle}
              aria-label={
                isEnabled ? "Deshabilitar integración" : "Habilitar integración"
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-300 top-1 ${
                  isEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Configuration Form */}
          {isEnabled && (
            <form action={installShopifyIntegration} onSubmit={handleSubmit}>
              {/* Hidden inputs for server action */}
              <input type="hidden" name="assistant" value={assistantId} />
              <input type="hidden" name="shop" value={storeUrl.trim()} />
              <input
                type="hidden"
                name="redirect_url"
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}${window.location.pathname}`
                    : ""
                }
              />

              {/* Assistant ID Input */}
              <div className="mb-5">
                <label
                  htmlFor="assistantId"
                  className="block font-medium mb-2 text-slate-700"
                >
                  Assistant ID
                </label>
                <input
                  type="text"
                  id="assistantId"
                  value={assistantId}
                  onChange={(e) => setAssistantId(e.target.value)}
                  className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-slate-300"
                  placeholder="asst_HddXQwDnR5Ng4YsZcthtmB9h"
                  autoComplete="off"
                />
                <div className="text-xs text-slate-500 mt-1">
                  ID del asistente al que conectar la integración
                </div>
              </div>

              {/* OAuth Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                <h5 className="text-blue-800 text-sm font-semibold mb-2">
                  🔐 Instalación Segura
                </h5>
                <p className="text-blue-700 text-xs leading-snug">
                  Al hacer clic en "Instalar Integración" serás redirigido a
                  Shopify para autorizar nuestra aplicación. Solo solicitamos
                  los permisos mínimos necesarios para la funcionalidad.
                </p>
              </div>

              {/* Store URL Input */}
              <div className="mb-5">
                <label
                  htmlFor="storeUrl"
                  className="block font-medium mb-2 text-slate-700"
                >
                  URL de tu tienda Shopify
                </label>
                <input
                  type="text"
                  id="storeUrl"
                  value={storeUrl}
                  onChange={handleStoreUrlChange}
                  className={`w-full px-4 py-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationState.error
                      ? "border-red-400"
                      : validationState.success
                      ? "border-green-400"
                      : "border-slate-300"
                  }`}
                  placeholder="tu-tienda.myshopify.com"
                  autoComplete="off"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Ingresa la URL completa de tu tienda (ejemplo:
                  mi-tienda.myshopify.com)
                </div>
                {validationState.error && (
                  <div className="text-xs text-red-600 mt-1">
                    {validationState.error}
                  </div>
                )}
                {validationState.success && (
                  <div className="text-xs text-green-600 mt-1">
                    ✓ {validationState.success}
                  </div>
                )}
              </div>

              {/* Install Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !validationState.isValid ||
                    !storeUrl.trim() ||
                    !assistantId.trim()
                  }
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationState.isValid &&
                    storeUrl.trim() &&
                    assistantId.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-400 text-white"
                  }`}
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isLoading ? "Procesando..." : "Instalar Integración"}
                </button>
              </div>

              {/* Connection Status */}
              {status && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg mt-4 ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : status.type === "error"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs text-white ${
                      status.type === "success"
                        ? "bg-green-500"
                        : status.type === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {status.type === "success"
                      ? "✓"
                      : status.type === "error"
                      ? "✗"
                      : "i"}
                  </div>
                  <span
                    className={`text-sm ${
                      status.type === "success"
                        ? "text-green-800"
                        : status.type === "error"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {status.message}
                  </span>
                </div>
              )}
            </form>
          )}

          {/* Features List */}
          <div className="bg-slate-50 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Funcionalidades incluidas:
            </h4>
            <ul className="space-y-2">
              {[
                "Sincronización automática del catálogo de productos",
                "Consulta de inventario en tiempo real",
                "Creación automática de órdenes borrador",
                "Acceso a información de clientes existentes",
                "Generación de enlaces de pago seguros",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
