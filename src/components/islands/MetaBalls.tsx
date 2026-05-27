import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface Props {
  count?: number;
  colorA?: [number, number, number];
  colorB?: [number, number, number];
  speed?: number;
  opacity?: number;
}

const vert = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const frag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform int uCount;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

float metaball(vec2 uv, vec2 c, float r) {
  return r / length(uv - c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float field = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uCount) break;
    float fi = float(i);
    vec2 c = vec2(
      sin(uTime * 0.35 + fi * 1.7) * 0.45,
      cos(uTime * 0.28 + fi * 2.1) * 0.32
    );
    float r = 0.10 + 0.04 * sin(uTime * 0.7 + fi);
    field += metaball(uv, c, r);
  }
  float intensity = smoothstep(1.0, 2.4, field);
  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 1.2, field * 0.5));
  gl_FragColor = vec4(color, intensity * uOpacity);
}
`;

export default function MetaBalls({
  count = 6,
  colorA = [1.0, 0.42, 0.1],
  colorB = [0.3, 0.79, 1.0],
  speed = 1,
  opacity = 0.55,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.style.background = `radial-gradient(circle at 30% 40%, rgba(255,106,26,0.35), transparent 50%), radial-gradient(circle at 70% 60%, rgba(76,201,255,0.35), transparent 50%)`;
      return;
    }

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    gl.canvas.style.position = "absolute";
    gl.canvas.style.inset = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uCount: { value: count },
        uColorA: { value: colorA },
        uColorB: { value: colorB },
        uOpacity: { value: opacity },
      },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId = 0;
    const start = performance.now();
    const loop = (now: number) => {
      program.uniforms.uTime.value = ((now - start) / 1000) * speed;
      renderer.render({ scene: mesh });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      gl.canvas.remove();
    };
  }, [count, colorA, colorB, speed, opacity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
