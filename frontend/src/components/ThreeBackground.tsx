"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Colors Configuration ---
    const colorStart = new THREE.Color("#818cf8");
    const colorEnd = new THREE.Color("#a78bfa");

    // --- 1. Floating Particles (120 sphere meshes) ---
    const particlesCount = 120;
    const particles: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      seed: number;
    }[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const geom = new THREE.SphereGeometry(0.04, 6, 6);
      
      // Inject vertex colors for the indigo-to-violet gradient
      const colors = [];
      const ratio = Math.random();
      const color = new THREE.Color().lerpColors(colorStart, colorEnd, ratio);
      for (let j = 0; j < geom.attributes.position.count; j++) {
        colors.push(color.r, color.g, color.b);
      }
      geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      const mat = new THREE.MeshBasicMaterial({
        vertexColors: true,
      });

      const mesh = new THREE.Mesh(geom, mat);
      
      // Scatter in a 3D field
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );
      
      scene.add(mesh);

      particles.push({
        mesh,
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        seed: Math.random() * 100,
      });
    }

    // --- Active-Slide Burst Setup ---
    const burstParticles: {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      age: number;
    }[] = [];
    const maxAge = 0.6; // 0.6 seconds

    const handleSlideChange = () => {
      // Spawn 20 burst particles on slide change
      for (let i = 0; i < 20; i++) {
        const geom = new THREE.SphereGeometry(0.04, 6, 6);
        const colors = [];
        const ratio = Math.random();
        const color = new THREE.Color().lerpColors(colorStart, colorEnd, ratio);
        
        for (let j = 0; j < geom.attributes.position.count; j++) {
          colors.push(color.r, color.g, color.b);
        }
        geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

        const mat = new THREE.MeshBasicMaterial({
          vertexColors: true,
        });

        const mesh = new THREE.Mesh(geom, mat);
        
        // Spawn from center
        mesh.position.set(0, 0, 0);
        mesh.scale.set(0, 0, 0);

        // Outward radial velocity from screen center
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.08;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const vz = (Math.random() - 0.5) * 0.06;

        scene.add(mesh);

        burstParticles.push({
          mesh,
          vx,
          vy,
          vz,
          age: 0,
        });
      }
    };

    window.addEventListener("carousel:slide", handleSlideChange);

    // --- 2. Ribbon Mesh ---
    const ribbonGeom = new THREE.PlaneGeometry(80, 3, 128, 1);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      opacity: 0.18,
      transparent: true,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
    ribbonMesh.position.set(0, 0, -2);
    scene.add(ribbonMesh);

    // --- 3. Mouse Parallax Configuration ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Window Resize Listener ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- Clock for Time-based Anim ---
    const clock = new THREE.Clock();

    // --- Animation Loop ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // 1. Slow particle drifts (sine wave on Y, random Z drift)
      particles.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(elapsedTime + p.seed) * 0.15;
        p.mesh.position.z = p.baseZ + Math.cos(elapsedTime * 0.5 + p.seed) * 0.1;
      });

      // 2. Animate burst particles (0 -> 1 -> 0 scaling)
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.age += 0.016; // approx 60fps delta

        const t = bp.age / maxAge;
        if (t >= 1) {
          scene.remove(bp.mesh);
          bp.mesh.geometry.dispose();
          if (Array.isArray(bp.mesh.material)) {
            bp.mesh.material.forEach((m) => m.dispose());
          } else {
            bp.mesh.material.dispose();
          }
          burstParticles.splice(i, 1);
        } else {
          bp.mesh.position.x += bp.vx;
          bp.mesh.position.y += bp.vy;
          bp.mesh.position.z += bp.vz;

          const scale = Math.sin(t * Math.PI) * 1.8;
          bp.mesh.scale.set(scale, scale, scale);
        }
      }

      // 3. Ribbon mesh wave update
      const posAttr = ribbonGeom.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const xVal = posAttr.getX(i);
        const yVal = Math.sin(xVal * 0.3 + elapsedTime * 1.5) * 0.15;
        posAttr.setY(i, yVal);
      }
      posAttr.needsUpdate = true;

      // Slow ribbon rotation around Y
      ribbonMesh.rotation.y += 0.0004;

      // 4. Mouse parallax smooth camera lerp (damping 0.05)
      const targetX = mouseX * 0.8;
      const targetY = mouseY * -0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("carousel:slide", handleSlideChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose scenes & render meshes
      particles.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
      });

      burstParticles.forEach((bp) => {
        scene.remove(bp.mesh);
        bp.mesh.geometry.dispose();
        if (Array.isArray(bp.mesh.material)) {
          bp.mesh.material.forEach((m) => m.dispose());
        } else {
          bp.mesh.material.dispose();
        }
      });

      scene.remove(ribbonMesh);
      ribbonGeom.dispose();
      ribbonMat.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 bg-neutral-950 pointer-events-none"
    />
  );
}
