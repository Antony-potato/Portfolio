// Metaballs con dithering Bayer 1-bit — WebGL puro, sin dependencias.
// Se renderiza a 1/PX de la resolución y se escala con `image-rendering: pixelated`:
// barato en móvil y le da el look lo-fi / pantalla TE.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform vec3 uColor;

float b2(vec2 a){a=floor(a);return fract(a.x*.5+a.y*a.y*.75);}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}

void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes.y;
  float f=0.;
  for(int i=0;i<7;i++){
    float fi=float(i);
    vec2 c=vec2(
      aspect*(.6+.34*sin(uTime*(.21+fi*.037)+fi*1.9)),
      .5+.38*cos(uTime*(.17+fi*.041)+fi*2.7)
    );
    float r=.055+.025*sin(fi*2.3+1.);
    vec2 d=uv-c;
    f+=r*r/dot(d,d);
  }
  vec2 dm=uv-uMouse;
  f+=uMouseOn*.008/dot(dm,dm);
  float v=smoothstep(.22,2.2,f);
  float on=step(b8(gl_FragCoord.xy)+.002,v);
  gl_FragColor=vec4(uColor,1.)*on;
}`;

export function initHeroGL(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true });
  if (!gl) return () => {};

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  // Triángulo que cubre toda la pantalla
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uMouseOn = u("uMouseOn");
  gl.uniform3f(u("uColor"), 1, 0.416, 0.102); // accent-500 #ff6a1a

  // Sin GPU real (SwiftShader, llvmpipe) el shader corre en CPU y bloquea el hilo principal:
  // en ese caso, igual que con reduced-motion, se pinta un solo frame fijo (DESIGN.md §10).
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches || /swiftshader|llvmpipe|software/i.test(renderer);
  const px = matchMedia("(pointer: coarse)").matches ? 3 : 4;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
  let raf = 0;
  let visible = true;
  const t0 = performance.now() - 20000; // arranca con las bolas ya repartidas

  const resize = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth / px));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight / px));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    if (still) draw(0);
  };

  const draw = (now: number) => {
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    mouse.on += (mouse.ton - mouse.on) * 0.05;
    gl.uniform1f(uTime, still ? 24 : (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uMouseOn, mouse.on);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    draw(now);
    raf = visible ? requestAnimationFrame(loop) : 0;
  };

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.height;
    mouse.ty = 1 - (e.clientY - r.top) / r.height;
    if (!mouse.ton) {
      mouse.x = mouse.tx;
      mouse.y = mouse.ty;
    }
    mouse.ton = e.clientY < r.bottom ? 1 : 0;
  };
  const onLeave = () => (mouse.ton = 0);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible && !raf && !still) raf = requestAnimationFrame(loop);
  });

  // Primer frame ya con tamaño real; luego el fade-in (CSS: [data-gl].is-on)
  resize();
  draw(performance.now());
  requestAnimationFrame(() => canvas.classList.add("is-on"));

  if (!still) {
    io.observe(canvas);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
  }

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
