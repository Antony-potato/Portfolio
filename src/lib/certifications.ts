import type { Lang } from "~/i18n/utils";

// placeholder: cambia cada `url: "#"` por el link público del certificado (Credly, PDF, etc.).
// Mientras sea "#", se muestra como texto, sin link.
export const certifications = (lang: Lang) => [
  { name: "AWS Academy Graduate — Data Engineering", issuer: "AWS Academy", url: "#" },
  { name: "Big Data Foundations — Level 1", issuer: "IBM", url: "#" },
  { name: "EF SET English C1 Advanced (67/100)", issuer: "EF SET", url: "#" },
  { name: "Spark — Level 1", issuer: "IBM", url: "#" },
  { name: "Networking Academy Learn-A-Thon 2024", issuer: "Cisco", url: "#" },
  { name: "Big Data Foundations — Level 2", issuer: "IBM", url: "#" },
  { name: lang === "es" ? "Figma Avanzado" : "Advanced Figma", issuer: "LinkedIn Learning", url: "#" },
  { name: "Hadoop Foundations — Level 1", issuer: "IBM", url: "#" },
  { name: "Big Data 101", issuer: "IBM · Cognitive Class", url: "#" },
  { name: "Innovation Meet Up", issuer: "Universidad Tecmilenio", url: "#" },
];
