import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const waveGeometryRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1e1b4b, 1, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1e1b4b, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle wave geometry
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0xa855f7); // Purple
    const color2 = new THREE.Color(0xec4899); // Pink
    const color3 = new THREE.Color(0x3b82f6); // Blue

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create wave-like distribution
      const radius = Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.random() * 30 - 15;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Color gradient based on position
      const mixRatio = Math.random();
      let color;
      if (mixRatio < 0.33) {
        color = color1;
      } else if (mixRatio < 0.66) {
        color = color2;
      } else {
        color = color3;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    waveGeometryRef.current = geometry;

    // Particle material with glow
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;

        void main() {
          vColor = customColor;
          
          vec3 pos = position;
          
          // Wave motion
          float wave = sin(pos.x * 0.1 + time * 0.5) * cos(pos.z * 0.1 + time * 0.3) * 2.0;
          pos.y += wave;
          
          // Spiral motion
          float angle = time * 0.2;
          float cosA = cos(angle);
          float sinA = sin(angle);
          float x = pos.x * cosA - pos.z * sinA;
          float z = pos.x * sinA + pos.z * cosA;
          pos.x = x;
          pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation with glow
          gl_PointSize = size * (300.0 / -mvPosition.z);
          
          // Alpha based on distance for depth effect
          vAlpha = 1.0 - (length(mvPosition.xyz) / 50.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Create circular particles with soft glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow effect
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 2.0);
          
          // Add bright center
          float glow = 1.0 - smoothstep(0.0, 0.3, dist);
          glow = pow(glow, 3.0);
          
          vec3 finalColor = vColor + vec3(glow * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Add ambient lighting waves
    const createLightWave = (color, position) => {
      const light = new THREE.PointLight(color, 2, 100);
      light.position.set(...position);
      scene.add(light);
      return light;
    };

    const lights = [
      createLightWave(0xa855f7, [20, 10, 20]),
      createLightWave(0xec4899, [-20, 10, -20]),
      createLightWave(0x3b82f6, [0, -10, 30])
    ];

    // Animation loop
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      // Update shader uniform
      material.uniforms.time.value = time;

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.1) * 5;
      camera.position.y = 10 + Math.cos(time * 0.15) * 3;
      camera.lookAt(0, 0, 0);

      // Animate lights
      lights.forEach((light, i) => {
        const angle = time * (0.2 + i * 0.1);
        const radius = 25;
        light.position.x = Math.cos(angle) * radius;
        light.position.z = Math.sin(angle) * radius;
        light.position.y = 10 + Math.sin(time * 0.5 + i) * 5;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      lights.forEach(light => scene.remove(light));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
      }}
    />
  );
};

export default BackgroundAnimation;
