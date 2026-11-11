// vCard estática para "Guardar contacto" en la tarjeta (/tarjeta, /en/card).
// Se genera en el build con los mismos datos de lib/contact.ts; la foto va incrustada (JPEG pequeño).
import type { APIRoute } from "astro";
import sharp from "sharp";
import { EMAIL, WHATSAPP_NUMBER } from "~/lib/contact";
import { SITE } from "~/lib/seo";

/** vCard 3.0: los renglones largos se parten a 75 caracteres con un espacio de continuación. */
const fold = (line: string) => line.match(/.{1,74}/g)?.join("\r\n ") ?? line;

export const GET: APIRoute = async ({ site }) => {
  // Recorte cuadrado alrededor de la persona (el retrato es un plano abierto de 808×1080)
  const photo = await sharp("src/assets/portrait.webp")
    .extract({ left: 144, top: 540, width: 520, height: 520 })
    .resize(360, 360)
    .jpeg({ quality: 78 })
    .toBuffer();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Cortazar Jimenez;Antonio;;;",
    "FN:Antonio Cortazar",
    "TITLE:Software Engineer",
    `TEL;TYPE=CELL,VOICE:+${WHATSAPP_NUMBER}`,
    `EMAIL;TYPE=INTERNET,WORK:${EMAIL}`,
    `URL:${new URL("/", site ?? SITE.url).href}`,
    "item1.URL:https://linkedin.com/in/antoniocortazar",
    "item1.X-ABLabel:LinkedIn",
    "item2.URL:https://github.com/Antony-potato",
    "item2.X-ABLabel:GitHub",
    "ADR;TYPE=WORK:;;;Cancún;Quintana Roo;;México",
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString("base64")}`,
    "END:VCARD",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
};
