import type { Lang } from "~/i18n/utils";

export interface Certification {
  name: string;
  issuer: string;
  icon: string;
  /** placeholder: cambia cada `url: "#"` por el link público del certificado (Credly, PDF, etc.) */
  url: string;
}

export function getCertifications(lang: Lang): Certification[] {
  return [
    { name: "AWS Academy Graduate — Data Engineering", issuer: "AWS Academy", icon: "simple-icons:amazonwebservices", url: "#" },
    { name: "Big Data Foundations — Level 1", issuer: "IBM", icon: "simple-icons:ibm", url: "#" },
    { name: "Big Data Foundations — Level 2", issuer: "IBM", icon: "simple-icons:ibm", url: "#" },
    { name: "Spark — Level 1", issuer: "IBM", icon: "simple-icons:apachespark", url: "#" },
    { name: "Hadoop Foundations — Level 1", issuer: "IBM", icon: "simple-icons:apachehadoop", url: "#" },
    { name: "Big Data 101", issuer: "IBM · Cognitive Class", icon: "simple-icons:ibm", url: "#" },
    { name: "EF SET English C1 Advanced (67/100)", issuer: "EF SET", icon: "lucide:languages", url: "#" },
    { name: "Networking Academy Learn-A-Thon 2024", issuer: "Cisco", icon: "simple-icons:cisco", url: "#" },
    { name: lang === "es" ? "Figma Avanzado" : "Advanced Figma", issuer: "LinkedIn Learning", icon: "simple-icons:figma", url: "#" },
    { name: "Innovation Meet Up", issuer: "Universidad Tecmilenio", icon: "lucide:graduation-cap", url: "#" },
  ];
}
