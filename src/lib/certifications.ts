import type { Lang } from "~/i18n/utils";

export interface Certification {
  /** lo que se ve en la banda */
  short: string;
  /** nombre completo + emisor: van al lector de pantalla */
  name: string;
  issuer: string;
  icon: string;
  /** placeholder: cambia cada `url: "#"` por el link público del certificado (Credly, PDF, etc.) */
  url: string;
}

export function getCertifications(lang: Lang): Certification[] {
  const figma = lang === "es" ? "Figma Avanzado" : "Advanced Figma";
  return [
    { short: "AWS Data Engineering", name: "AWS Academy Graduate — Data Engineering", issuer: "AWS Academy", icon: "simple-icons:amazonwebservices", url: "#" },
    { short: "Big Data Foundations L1", name: "Big Data Foundations — Level 1", issuer: "IBM", icon: "simple-icons:ibm", url: "#" },
    { short: "English C1", name: "EF SET English C1 Advanced (67/100)", issuer: "EF SET", icon: "lucide:languages", url: "#" },
    { short: "Spark L1", name: "Spark — Level 1", issuer: "IBM", icon: "simple-icons:apachespark", url: "#" },
    { short: "Cisco Learn-A-Thon", name: "Networking Academy Learn-A-Thon 2024", issuer: "Cisco", icon: "simple-icons:cisco", url: "#" },
    { short: "Big Data Foundations L2", name: "Big Data Foundations — Level 2", issuer: "IBM", icon: "simple-icons:ibm", url: "#" },
    { short: figma, name: figma, issuer: "LinkedIn Learning", icon: "simple-icons:figma", url: "#" },
    { short: "Hadoop L1", name: "Hadoop Foundations — Level 1", issuer: "IBM", icon: "simple-icons:apachehadoop", url: "#" },
    { short: "Big Data 101", name: "Big Data 101", issuer: "IBM · Cognitive Class", icon: "simple-icons:ibm", url: "#" },
    { short: "Innovation Meet Up", name: "Innovation Meet Up", issuer: "Universidad Tecmilenio", icon: "lucide:graduation-cap", url: "#" },
  ];
}
