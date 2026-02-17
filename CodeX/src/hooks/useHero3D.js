import { useEffect } from "react";
import * as THREE from "three";

export function useHero3D(heroCanvasRef, heroCardRef) {
  useEffect(() => {
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const canvas = heroCanvasRef.current;
    const card = heroCardRef.current;
    if (!canvas || !card) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.1, 3.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.75);
    keyLight.position.set(2, 2, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(-2, -1, 2);
    scene.add(rimLight);

    const torusGeometry = new THREE.TorusKnotGeometry(0.78, 0.22, 220, 24);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.65,
      roughness: 0.25,
      transparent: true,
      opacity: 0.4,
    });
    const mesh = new THREE.Mesh(torusGeometry, torusMaterial);
    mesh.rotation.set(0.4, 0.2, 0.0);
    scene.add(mesh);

    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.06, 18, 18);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.2,
      transparent: true,
      opacity: 0.18,
    });

    for (let i = 0; i < 18; i += 1) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.5,
      );
      sphere.userData = {
        baseX: sphere.position.x,
        baseY: sphere.position.y,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      };
      spheres.push(sphere);
      scene.add(sphere);
    }

    const onResize = () => {
      const width = card.clientWidth;
      const height = card.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let animationFrameId = 0;
    let previousTime = performance.now();

    const animate = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      mesh.rotation.y += delta * 0.22;
      mesh.rotation.x += delta * 0.08;

      camera.position.x = Math.sin(time * 0.00025) * 0.08;
      camera.position.y = 0.1 + Math.sin(time * 0.00018) * 0.05;
      camera.lookAt(0, 0, 0);

      spheres.forEach((sphere) => {
        const phase = sphere.userData.phase + time * 0.001 * sphere.userData.speed;
        sphere.position.x = sphere.userData.baseX + Math.sin(phase) * 0.1;
        sphere.position.y = sphere.userData.baseY + Math.cos(phase) * 0.1;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        previousTime = performance.now();
      }
    };

    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      torusGeometry.dispose();
      torusMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
    };
  }, [heroCanvasRef, heroCardRef]);
}
