// Efecto "TechText" del nombre del hero. Port a TypeScript sin React del componente TechText de
// React Bits (reactbits.dev), en su modo reveal="letter": la letra bajo el puntero (o bajo un barrido
// automático) pasa a su contorno punteado dentro de un marco de selección con motas y etiqueta; las
// letras se arrastran y vuelven con resorte, y un clic las patea con una onda hacia las vecinas.
//
// Diferencias con el original:
// - No compone el texto: lee la posición de cada letra del DOM (.split-char de SplitTitle), así el
//   canvas calca el título real (una línea en escritorio, dos en móvil) y el HTML sigue siendo la
//   primera pintura, el LCP y el respaldo sin JS o con reduced-motion.
// - La ficha del pato (.hero-tile) entra como un "glifo" más.
// - Sin los modos area/intro/guides, que el hero no usa.

const LABEL_FONT = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SPRING = 320;
const BOUNCE = 0.4;
const KICK_DECAY = 0.62;
const DASH = [4, 2];
const STROKE = 1.5;
const SPECKS = 15;
const SPEED = 1;

interface Sprite {
  image: HTMLCanvasElement;
  left: number;
  top: number;
}
interface Glyph {
  char: string;
  tile: boolean;
  box: { x1: number; y1: number; x2: number; y2: number };
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  fill: Sprite;
  dashes: Sprite;
}

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const noise = (...values: number[]) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");

/**
 * @param title  el <h1> con las letras (.split-char) y la ficha (.hero-tile)
 * @param canvas canvas absoluto que cubre el título con margen
 * @param zone   elemento que recibe los eventos de puntero (el hero completo)
 */
export function initTechText(title: HTMLElement, canvas: HTMLCanvasElement, zone: HTMLElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let alive = true;
  let started = false;
  let ready = false;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let dirty = true;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let ink = "";
  let fontSize = 100;
  let glyphs: Glyph[] = [];
  let lines: Array<{ left: number; right: number; y: number }> = [];
  let bounds = { left: 0, right: 0, top: 0, bottom: 0 };
  let clock = 0;
  let pulse = 0;
  let placed = false;
  let dragging = -1;
  let cursor = "";
  const kicks: Array<{ index: number; at: number; velocity: number }> = [];
  const press = { x: 0, y: 0, time: 0, index: -1 };
  const pointer = { x: 0, y: 0, inside: false };
  const grab = { x: 0, y: 0 };
  const lens = { x: 0, y: 0 };
  const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

  // El pato de la ficha (SVG negro): se tiñe con la tinta actual
  const duck = new Image();
  let duckReady = false;
  duck.onload = () => {
    duckReady = true;
    dirty = true;
    wake();
  };
  duck.src = "/logo-ac.svg";

  const blank = (w: number, h: number) => {
    const image = document.createElement("canvas");
    image.width = Math.max(1, Math.ceil(w * dpr));
    image.height = Math.max(1, Math.ceil(h * dpr));
    return image;
  };

  /** Sprite de una letra: relleno sólido o solo su silueta exterior punteada. */
  const letterSprite = (char: string, x: number, baseline: number, box: Glyph["box"], font: string, stroke: boolean): Sprite => {
    const pad = Math.ceil(STROKE * 2 + 4);
    const left = box.x1 - pad;
    const top = box.y1 - pad;
    const image = blank(box.x2 - box.x1 + pad * 2, box.y2 - box.y1 + pad * 2);
    const c = image.getContext("2d");
    if (!c) return { image, left, top };
    c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
    c.font = font;
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
    if (stroke) {
      c.lineJoin = "round";
      c.lineWidth = STROKE * 2;
      c.strokeStyle = ink;
      c.setLineDash(DASH);
      c.strokeText(char, x, baseline);
      c.setLineDash([]);
      c.globalCompositeOperation = "destination-out";
      c.fillStyle = "#000";
      c.fillText(char, x, baseline);
    } else {
      c.fillStyle = ink;
      c.fillText(char, x, baseline);
    }
    return { image, left, top };
  };

  /** Sprite de la ficha: bloque de tinta con el pato calado, o marco punteado con el pato en tinta. */
  const tileSprite = (box: Glyph["box"], stroke: boolean): Sprite => {
    const pad = Math.ceil(STROKE * 2 + 4);
    const left = box.x1 - pad;
    const top = box.y1 - pad;
    const w = box.x2 - box.x1;
    const h = box.y2 - box.y1;
    const image = blank(w + pad * 2, h + pad * 2);
    const c = image.getContext("2d");
    if (!c) return { image, left, top };
    c.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
    // El pato cabe en el 82 % del alto (mismo aire que tenía la ficha en CSS)
    const dh = h * 0.82;
    const dw = duckReady && duck.naturalHeight ? (dh * duck.naturalWidth) / duck.naturalHeight : dh;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    if (stroke) {
      if (duckReady) {
        c.drawImage(duck, dx, dy, dw, dh);
        c.globalCompositeOperation = "source-in";
        c.fillStyle = ink;
        c.fillRect(0, 0, w, h);
        c.globalCompositeOperation = "source-over";
      }
      c.strokeStyle = ink;
      c.lineWidth = STROKE;
      c.setLineDash(DASH);
      c.strokeRect(STROKE / 2, STROKE / 2, w - STROKE, h - STROKE);
    } else {
      c.fillStyle = ink;
      c.fillRect(0, 0, w, h);
      if (duckReady) {
        c.globalCompositeOperation = "destination-out";
        c.drawImage(duck, dx, dy, dw, dh);
      }
    }
    return { image, left, top };
  };

  /** Lee del DOM dónde está cada letra y arma los sprites. */
  const layout = () => {
    dirty = false;
    const area = canvas.getBoundingClientRect();
    width = Math.max(1, area.width);
    height = Math.max(1, area.height);
    dpr = Math.min(devicePixelRatio || 1, 2);
    const pw = Math.round(width * dpr);
    const ph = Math.round(height * dpr);
    if (canvas.width !== pw) canvas.width = pw;
    if (canvas.height !== ph) canvas.height = ph;

    const style = getComputedStyle(title);
    ink = style.color || "#000";
    fontSize = Number.parseFloat(style.fontSize) || 100;
    const font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    // Las métricas dependen de textBaseline: drawFrame lo deja en "bottom" para la etiqueta,
    // así que se restablece antes de medir (si no, las letras salen recortadas al rehacer el layout)
    ctx.font = font;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const metrics = ctx.measureText("x");
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;

    const previous = glyphs;
    glyphs = [];
    title.querySelectorAll<HTMLElement>(".split-char, .hero-tile").forEach((el) => {
      const r = el.getBoundingClientRect();
      const x = r.left - area.left;
      const y = r.top - area.top;
      const tile = el.classList.contains("hero-tile");
      const char = tile ? "AC" : (el.textContent ?? "");
      if (!tile && !char.trim()) return;
      let box: Glyph["box"];
      let fill: Sprite;
      let dashes: Sprite;
      if (tile) {
        box = { x1: x, y1: y, x2: x + r.width, y2: y + r.height };
        fill = tileSprite(box, false);
        dashes = tileSprite(box, true);
      } else {
        // La caja de cada letra mide lo que su line-height: la línea base queda a medio interlineado + ascendente
        const baseline = y + (r.height - (ascent + descent)) / 2 + ascent;
        const m = ctx.measureText(char);
        box = {
          x1: x - m.actualBoundingBoxLeft,
          y1: baseline - m.actualBoundingBoxAscent,
          x2: x + m.actualBoundingBoxRight,
          y2: baseline + m.actualBoundingBoxDescent,
        };
        fill = letterSprite(char, x, baseline, box, font, false);
        dashes = letterSprite(char, x, baseline, box, font, true);
      }
      const kept = previous[glyphs.length];
      const same = kept?.char === char;
      glyphs.push({
        char,
        tile,
        box,
        fill,
        dashes,
        offset: same ? kept.offset : { x: 0, y: 0 },
        velocity: same ? kept.velocity : { x: 0, y: 0 },
        outline: same ? kept.outline : 0,
      });
    });

    // Renglones (uno en escritorio, dos en móvil) para el barrido automático
    lines = [];
    bounds = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
    for (const g of glyphs) {
      const cy = (g.box.y1 + g.box.y2) / 2;
      let line = lines.find((l) => Math.abs(l.y - cy) < fontSize * 0.4);
      if (!line) lines.push((line = { left: g.box.x1, right: g.box.x2, y: cy }));
      line.left = Math.min(line.left, g.box.x1);
      line.right = Math.max(line.right, g.box.x2);
      bounds.left = Math.min(bounds.left, g.box.x1);
      bounds.right = Math.max(bounds.right, g.box.x2);
      bounds.top = Math.min(bounds.top, g.box.y1);
      bounds.bottom = Math.max(bounds.bottom, g.box.y2);
    }
    lines.sort((a, b) => a.y - b.y);
    if (dragging >= glyphs.length) dragging = -1;
    if (frame.index >= glyphs.length) frame.index = -1;
  };

  const glyphAt = (x: number, y: number) => {
    let best = -1;
    let bestDistance = Infinity;
    glyphs.forEach((glyph, i) => {
      const x1 = glyph.box.x1 + glyph.offset.x;
      const x2 = glyph.box.x2 + glyph.offset.x;
      const y1 = glyph.box.y1 + glyph.offset.y;
      const y2 = glyph.box.y2 + glyph.offset.y;
      const dx = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
      const dy = y < y1 ? y1 - y : y > y2 ? y - y2 : 0;
      const d = Math.hypot(dx, dy);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    return bestDistance < 28 ? best : -1;
  };

  const blit = (art: Sprite, dx: number, dy: number) =>
    ctx.drawImage(art.image, Math.round((art.left + dx) * dpr), Math.round((art.top + dy) * dpr));

  const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr;

  const perimeterPoint = (distance: number, w: number, h: number): [number, number, number, number] => {
    let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
    if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
    d -= w;
    if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
    d -= h;
    if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
    d -= w;
    return [frame.x1, frame.y2 - d, -1, 0];
  };

  const drawSpecks = (a: number) => {
    const w = frame.x2 - frame.x1;
    const h = frame.y2 - frame.y1;
    if (w < 2 || h < 2) return;
    const perimeter = 2 * (w + h);
    const seed = frame.index + 1;
    const grid = 3;

    for (let k = 0; k < SPECKS; k++) {
      const period = 0.5 + noise(seed, k, 11) * 1.2;
      const t = pulse / period + noise(seed, k, 17);
      const cycle = Math.floor(t);
      const life = t - cycle;
      if (life > 0.7) continue;
      const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
      const pick = noise(seed, k, cycle, 2);
      const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
      const large = size >= 8;
      const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
      const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
      const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
      const tone = noise(seed, k, cycle, 3);
      const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
      const left = Math.round(x - size / 2);
      const top = Math.round(y - size / 2);
      ctx.globalAlpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
      if (tone < 0.26 || (large && tone < 0.78)) {
        ctx.strokeRect(left + 0.5, top + 0.5, size, size);
        if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      } else {
        ctx.fillRect(left, top, size, size);
      }
    }

    // Dos cometas que recorren el marco
    for (let j = 0; j < 2; j++) {
      const head = (pulse * 0.42 * SPEED + j * 0.5) * perimeter;
      for (let i = 0; i < 4; i++) {
        const [x, y] = perimeterPoint(head - i * 6, w, h);
        const size = i === 0 ? 3 : 2;
        ctx.globalAlpha = a * (i === 0 ? 0.95 : i === 1 ? 0.55 : i === 2 ? 0.32 : 0.16);
        ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
      }
    }
    ctx.globalAlpha = 1;
  };

  const drawFrame = (accent: string) => {
    const glyph = glyphs[frame.index];
    if (!glyph || frame.alpha < 0.01) return;
    const a = frame.alpha;
    const x1 = crisp(frame.x1);
    const y1 = crisp(frame.y1);
    const x2 = crisp(frame.x2);
    const y2 = crisp(frame.y2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;

    // Letra arrastrada: línea punteada hasta su sitio
    const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
    if (moved > 1) {
      const hx = (glyph.box.x1 + glyph.box.x2) / 2;
      const hy = (glyph.box.y1 + glyph.box.y2) / 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
      ctx.setLineDash([3, 4]);
      ctx.globalAlpha = 0.45 * a;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.7 * a;
      ctx.fillRect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
    }

    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.globalAlpha = 0.5 * a;
    ctx.stroke();

    ctx.globalAlpha = 0.95 * a;
    for (const [cx, cy] of [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
    ] as const)
      ctx.fillRect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
    ctx.globalAlpha = 1;

    drawSpecks(a);

    ctx.font = LABEL_FONT;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.62 * a;
    const label =
      moved > 1
        ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
        : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
    ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const kick = (index: number) => {
    const strength = fontSize * 11;
    kicks.push({ index, at: pulse, velocity: strength });
    for (let d = 1; d < glyphs.length; d++) {
      const velocity = strength * KICK_DECAY ** d;
      if (velocity < 30) break;
      for (const j of [index - d, index + d])
        if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity });
    }
    wake();
  };

  const tick = (now: number) => {
    raf = 0;
    const color = getComputedStyle(title).color;
    if (dirty || color !== ink) layout();
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const accent = getComputedStyle(title).getPropertyValue("--tech-accent").trim() || ink;
    const damping = 2 * Math.sqrt(SPRING) * (1 - BOUNCE * 0.96);

    // Barrido automático mientras el puntero está fuera: recorre un renglón por pasada
    const sweeping = !pointer.inside && dragging < 0 && lines.length > 0;
    if (sweeping) clock += dt * SPEED;
    pulse += dt;
    let targetX = pointer.x;
    let targetY = pointer.y;
    if (sweeping) {
      const phase = clock * 0.45;
      const line = lines[Math.floor(phase / Math.PI) % lines.length] ?? lines[0]!;
      targetX = line.left + (line.right - line.left) * (0.5 - 0.5 * Math.cos(phase));
      targetY = line.y;
    }
    const active = pointer.inside || sweeping || dragging >= 0;
    if (active && !placed) {
      lens.x = targetX;
      lens.y = targetY;
    }
    if (active) {
      const lag = pointer.inside ? 0.05 : 0.22;
      lens.x = approach(lens.x, targetX, dt, lag);
      lens.y = approach(lens.y, targetY, dt, lag);
    }
    placed = active;

    for (let k = kicks.length - 1; k >= 0; k--) {
      const item = kicks[k]!;
      if (item.at > pulse) continue;
      const glyph = glyphs[item.index];
      if (glyph) glyph.velocity.y -= item.velocity;
      kicks.splice(k, 1);
    }

    let moving = false;
    glyphs.forEach((glyph, i) => {
      const { offset, velocity } = glyph;
      if (i === dragging) {
        offset.x = approach(offset.x, pointer.x - grab.x, dt, 0.03);
        offset.y = approach(offset.y, pointer.y - grab.y, dt, 0.03);
        velocity.x = 0;
        velocity.y = 0;
        moving = true;
        return;
      }
      if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
        offset.x = offset.y = velocity.x = velocity.y = 0;
        return;
      }
      velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
      velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
      offset.x += velocity.x * dt;
      offset.y += velocity.y * dt;
      moving = true;
    });

    const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
    const target = glyphs[focus];
    if (target) {
      const bx1 = target.box.x1 + target.offset.x - 6;
      const by1 = target.box.y1 + target.offset.y - 6;
      const bx2 = target.box.x2 + target.offset.x + 6;
      const by2 = target.box.y2 + target.offset.y + 6;
      if (frame.index < 0 || frame.alpha < 0.02) {
        frame.x1 = bx1;
        frame.y1 = by1;
        frame.x2 = bx2;
        frame.y2 = by2;
      }
      const glide = focus === dragging ? 0.02 : 0.08;
      frame.x1 = approach(frame.x1, bx1, dt, glide);
      frame.y1 = approach(frame.y1, by1, dt, glide);
      frame.x2 = approach(frame.x2, bx2, dt, glide);
      frame.y2 = approach(frame.y2, by2, dt, glide);
      frame.index = focus;
    }
    frame.alpha = approach(frame.alpha, target ? 1 : 0, dt, 0.1);

    glyphs.forEach((glyph, i) => {
      const goal = i === focus && i !== dragging ? 1 : 0;
      glyph.outline = approach(glyph.outline, goal, dt, 0.09);
      if (Math.abs(glyph.outline - goal) > 0.002) moving = true;
      else glyph.outline = goal;
    });

    const hovering = focus >= 0 && pointer.inside;
    const nextCursor = dragging >= 0 ? "grabbing" : hovering ? "grab" : "";
    if (nextCursor !== cursor) zone.style.cursor = cursor = nextCursor;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Huella punteada donde vive cada letra que anda fuera de su sitio
    for (const glyph of glyphs) {
      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
        blit(glyph.dashes, 0, 0);
      }
    }
    for (const glyph of glyphs) {
      if (glyph.outline < 0.999) {
        ctx.globalAlpha = 1 - glyph.outline;
        blit(glyph.fill, glyph.offset.x, glyph.offset.y);
      }
      if (glyph.outline > 0.001) {
        ctx.globalAlpha = glyph.outline;
        blit(glyph.dashes, glyph.offset.x, glyph.offset.y);
      }
    }
    ctx.globalAlpha = 1;
    drawFrame(accent);

    // El canvas ya pintó el título completo: el HTML se oculta (sigue ocupando su lugar)
    if (!ready) {
      ready = true;
      title.classList.add("is-tech");
    }

    const settling = moving || kicks.length > 0 || (frame.alpha > 0.01 && frame.alpha < 0.99);
    if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
  };

  function wake() {
    if (raf || !visible || !alive || !started) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  const locate = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onMove = (e: PointerEvent) => {
    locate(e);
    pointer.inside = true;
    wake();
  };
  const onLeave = () => {
    if (dragging >= 0) return;
    pointer.inside = false;
    wake();
  };
  const onDown = (e: PointerEvent) => {
    locate(e);
    pointer.inside = true;
    const primary = e.pointerType !== "mouse" || e.button === 0;
    const index = primary && ready ? glyphAt(pointer.x, pointer.y) : -1;
    press.x = pointer.x;
    press.y = pointer.y;
    press.time = performance.now();
    press.index = index;
    const glyph = glyphs[index];
    if (glyph) {
      dragging = index;
      grab.x = pointer.x - glyph.offset.x;
      grab.y = pointer.y - glyph.offset.y;
      zone.setPointerCapture?.(e.pointerId);
    }
    wake();
  };
  const onUp = (e: PointerEvent) => {
    if (dragging >= 0) {
      dragging = -1;
      zone.releasePointerCapture?.(e.pointerId);
      const rect = zone.getBoundingClientRect();
      pointer.inside =
        e.pointerType === "mouse" && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    }
    if (e.type === "pointerup" && press.index >= 0 && performance.now() - press.time < 450) {
      const rect = canvas.getBoundingClientRect();
      if (Math.hypot(e.clientX - rect.left - press.x, e.clientY - rect.top - press.y) < 6) kick(press.index);
    }
    press.index = -1;
    // En táctil no hay "leave": al soltar, el barrido automático retoma
    if (e.pointerType !== "mouse") pointer.inside = false;
    wake();
  };
  // Arrastrar una letra no debe seleccionar texto ni arrastrar la imagen fantasma
  const onSelect = (e: Event) => {
    if (dragging >= 0) e.preventDefault();
  };

  const markDirty = () => {
    dirty = true;
    wake();
  };

  zone.addEventListener("pointermove", onMove, { passive: true });
  zone.addEventListener("pointerdown", onDown, { passive: true });
  zone.addEventListener("pointerup", onUp, { passive: true });
  zone.addEventListener("pointercancel", onUp, { passive: true });
  zone.addEventListener("pointerleave", onLeave, { passive: true });
  zone.addEventListener("selectstart", onSelect);

  const resizeObserver = new ResizeObserver(markDirty);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    wake();
  });
  intersectionObserver.observe(canvas);
  // Cambio de tema claro/oscuro: la tinta cambia y hay que rehacer los sprites
  // (Lenis también cambia clases de <html> al hacer scroll: solo cuenta el cambio de tema)
  let dark = document.documentElement.classList.contains("theme-dark");
  const themeObserver = new MutationObserver(() => {
    const next = document.documentElement.classList.contains("theme-dark");
    if (next === dark) return;
    dark = next;
    markDirty();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // Arranca cuando el intro CSS del título ya terminó (con loader, espera a que la cortina lo suelte)
  // y las fuentes cargaron: antes de eso las letras aún se mueven y no se pueden calcar.
  const intro = title.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {}));
  Promise.all([document.fonts.ready, ...intro]).then(() => {
    if (!alive) return;
    started = true;
    wake();
  });

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    zone.style.cursor = "";
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerdown", onDown);
    zone.removeEventListener("pointerup", onUp);
    zone.removeEventListener("pointercancel", onUp);
    zone.removeEventListener("pointerleave", onLeave);
    zone.removeEventListener("selectstart", onSelect);
    title.classList.remove("is-tech");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
