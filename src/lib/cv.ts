import { existsSync } from "node:fs";

// Solo servidor (build). El botón de CV aparece cuando exista este PDF en public/.
export const CV_PATH = "/cv-antonio-cortazar.pdf";
export const hasCv = existsSync(`public${CV_PATH}`);
