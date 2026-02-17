import { useEffect } from "react";
import * as THREE from "three";

export function useLiquidEtherBackground(liquidCanvasRef) {
  useEffect(() => {
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const canvas = liquidCanvasRef.current;
    if (!canvas) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    const SCALE = 0.8;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 1.0 },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uRes;
      uniform vec2 uMouse;
      uniform float uIntensity;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for(int i=0;i<5;i++){
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        vec2 p = (uv - 0.5);
        p.x *= uRes.x / uRes.y;

        float t = uTime * 0.18;

        vec2 m = uMouse - 0.5;
        m.x *= uRes.x / uRes.y;

        vec2 q = p;
        q += 0.10 * sin(vec2(q.y, q.x) * 3.0 + t * 3.0);
        q += 0.06 * sin(vec2(q.y, q.x) * 7.0 - t * 2.0);

        float n1 = fbm(q * 2.0 + t);
        float n2 = fbm(q * 3.2 - t * 1.4);
        float flow = n1 * 0.65 + n2 * 0.35;

        float md = length(p - m);
        float pull = smoothstep(1.0, 0.0, md) * 0.18;
        q += (m - p) * pull;

        float waves = sin((q.x + q.y) * 6.0 + flow * 4.0 + t * 6.0) * 0.5 + 0.5;
        float mask = smoothstep(1.2, 0.0, length(p));

        vec3 c1 = vec3(0.55, 0.95, 1.00);
        vec3 c2 = vec3(0.72, 0.62, 1.00);
        vec3 c3 = vec3(0.30, 0.95, 0.78);

        vec3 col = mix(c1, c2, smoothstep(0.15, 0.85, flow));
        col = mix(col, c3, smoothstep(0.30, 0.95, waves) * 0.55);

        col *= 0.55 + 0.65 * flow;
        col *= 0.85 + 0.35 * mask;

        float vig = smoothstep(1.15, 0.2, length(p));
        col *= 0.65 + 0.55 * vig;

        float alpha = 0.85 * uIntensity;
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      uniforms.uRes.value.set(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(Math.floor(width * SCALE), Math.floor(height * SCALE), false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const onPointerMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight;
      uniforms.uMouse.value.set(x, y);
    };

    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let animationFrameId = 0;
    const startTime = performance.now();
    const animate = (now) => {
      uniforms.uTime.value = (now - startTime) * 0.001;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [liquidCanvasRef]);
}
