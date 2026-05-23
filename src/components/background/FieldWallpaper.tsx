"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform vec2  uMouseS;
uniform float uTime;
uniform float uClickT;
uniform vec2  uClickP;
uniform float uPress;

const vec3 PAPER = vec3(0.965, 0.953, 0.925);
const vec3 DEEP  = vec3(0.102, 0.227, 0.165);
const vec3 SAGE  = vec3(0.772, 0.831, 0.710);
const vec3 MOSS  = vec3(0.435, 0.541, 0.373);
const vec3 OLIVE = vec3(0.576, 0.663, 0.510);

float hash12(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash12(i),         hash12(i+vec2(1,0)),u.x),
             mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y);
}
float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<5;i++){ v += a*vnoise(p); p = p*2.03 + vec2(1.7,-1.3); a *= 0.5; }
  return v;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes.xy) / uRes.y;
  vec2 m = (uMouseS - 0.5) * vec2(uRes.x/uRes.y, 1.0);

  vec2 d = p - m;
  float r = length(d);
  vec2  warp = d * 0.18 / (r*r + 0.06);
  warp *= 0.5 + 0.5*uPress;

  float ct = max(uTime - uClickT, 0.0);
  float pulse = exp(-ct*1.6) * sin(ct*7.0 - r*10.0);

  vec2 q = p + warp*0.35 + pulse*0.04*normalize(d+0.0001);
  q += vec2(uTime*0.03, -uTime*0.022);

  float n  = fbm(q*2.2);
  float n2 = fbm(q*4.6 + n*1.4 + uTime*0.05);

  float band = sin(n*6.2831 + uTime*0.25 + n2*1.5)*0.5 + 0.5;

  vec3 col = mix(PAPER, SAGE, smoothstep(0.25, 0.78, n));
  col = mix(col, OLIVE, smoothstep(0.55, 0.95, n2) * 0.55);
  col = mix(col, DEEP,  smoothstep(0.88, 1.02, n2) * 0.45);
  col = mix(col, PAPER, band*0.10);

  col = mix(col, PAPER, smoothstep(0.35, 0.0, r) * 0.35);
  col = mix(col, DEEP, smoothstep(0.06, 0.0, r) * uPress * 0.6);

  col += (hash12(gl_FragCoord.xy) - 0.5) * 0.012;
  col *= 1.0 - 0.16*smoothstep(0.3, 1.1, length(p));

  gl_FragColor = vec4(col, 1.0);
}
`;

export function FieldWallpaper({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "a");
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = {
      uRes: gl.getUniformLocation(prog, "uRes"),
      uMouseS: gl.getUniformLocation(prog, "uMouseS"),
      uTime: gl.getUniformLocation(prog, "uTime"),
      uClickT: gl.getUniformLocation(prog, "uClickT"),
      uClickP: gl.getUniformLocation(prog, "uClickP"),
      uPress: gl.getUniformLocation(prog, "uPress"),
    };

    const state = {
      mouse: [0.5, 0.5],
      mouseS: [0.5, 0.5],
      clickP: [0.5, 0.5],
      clickT: -10,
      press: 0,
      start: performance.now(),
    };

    function setMouse(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      state.mouse[0] = x;
      state.mouse[1] = y;
    }
    const onDown = (e: PointerEvent) => {
      setMouse(e);
      state.press = 1;
      state.clickP[0] = state.mouse[0];
      state.clickP[1] = state.mouse[1];
      state.clickT = (performance.now() - state.start) / 1000;
    };
    const onUp = () => {
      state.press = 0;
    };

    window.addEventListener("pointermove", setMouse, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas!.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let lastT = performance.now();
    function frame(now: number) {
      resize();
      const t = (now - state.start) / 1000;
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const k = 1 - Math.pow(0.001, dt);
      state.mouseS[0] += (state.mouse[0] - state.mouseS[0]) * k;
      state.mouseS[1] += (state.mouse[1] - state.mouseS[1]) * k;

      gl!.useProgram(prog);
      gl!.uniform2f(U.uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(U.uMouseS, state.mouseS[0], state.mouseS[1]);
      gl!.uniform1f(U.uTime, reduce ? 0 : t);
      gl!.uniform1f(U.uClickT, state.clickT);
      gl!.uniform2f(U.uClickP, state.clickP[0], state.clickP[1]);
      gl!.uniform1f(U.uPress, state.press);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", setMouse);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "block h-full w-full"}
      style={{ background: "#f6f3ec" }}
      aria-hidden
    />
  );
}
