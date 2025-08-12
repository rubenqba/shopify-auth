"use server";

import { redirect } from "next/navigation";

export async function installShopifyIntegration(formData: FormData) {
  try {
    const assistant = formData.get("assistant") as string;
    const shop = formData.get("shop") as string;
    const redirectUrl = formData.get("redirect_url") as string;

    if (!assistant || !shop || !redirectUrl) {
      throw new Error("Faltan parámetros requeridos");
    }

    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error(
        "ACCESS_TOKEN no está configurado en las variables de entorno"
      );
    }

    // Construir URL con query parameters como originalmente especificado
    const params = new URLSearchParams({
      shop: shop,
      redirect_url: redirectUrl,
    });

    const apiUrl = `https://qbamacbook-pro.tail571a1b.ts.net/api/business/${assistant}/integrations/shopify/install?${params.toString()}`;

    console.log("Making request to:", apiUrl);
    console.log("Assistant ID:", assistant);
    console.log("Shop:", shop);
    console.log("Redirect URL:", redirectUrl);
    console.log("Has access token:", !!accessToken);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      // Try to get error details from response
      try {
        const errorText = await response.text();
        console.log("Error response body:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - ${errorText}`
        );
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log("Response data:", data);

    if (data.redirect_url) {
      // Redirect to Shopify using Next.js redirect
      redirect(data.redirect_url);
    } else {
      throw new Error(
        "No se recibió la URL de redirección en el atributo 'redirect_url'"
      );
    }
  } catch (error) {
    console.error("Error in server action:", error);
    // Re-throw the error so it can be handled by the form
    throw error;
  }
}
