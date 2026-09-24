// Datos de contacto compartidos. Un solo lugar para cambiar número o correo.

export const EMAIL = "hola@antoniocortazar.dev";

/** Número en formato internacional sin "+" (52 = México). */
export const WHATSAPP_NUMBER = "528135112848";
export const PHONE_DISPLAY = "81 3511 2848";

/** Link de WhatsApp (wa.me) con mensaje opcional precargado. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
