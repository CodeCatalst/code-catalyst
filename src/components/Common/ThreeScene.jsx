import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { createNoise3D } from 'simplex-noise';

const noise = createNoise3D();
console.log(noise(1.1, 2.2, 3.3));



const StarfieldScene = ({ scrollProgress = 0 }) => {
    const containerRef = useRef();
    const scrollProgressRef = useRef(scrollProgress);

    // Update ref when prop changes
    useEffect(() => {
        scrollProgressRef.current = scrollProgress * 2;
    }, [scrollProgress]);

    useEffect(() => {
        let renderer, scene, camera, sphereBg, nucleus, stars, controls, clock;
        let timeoutDebounce;
        let delta = 0;
        const noise = createNoise3D();

        console.log('Simplex noise test:', noise(1, 2, 3));

        const blobScale = 3;

        // Responsive sphere sizing
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isDesktop = window.innerWidth > 1024;

        // Responsive sphere radius based on screen size
        let baseSphereRadius;
        if (isMobile) {
            baseSphereRadius = 40; // Mobile: 54 units
        } else if (isTablet) {
            baseSphereRadius = 75; // Tablet: 75 units
        } else {
            baseSphereRadius = 90; // Desktop: 90 units
        }

        const maxScale = isMobile ? 1.5 : 1.5; // Scale from 100 to 150 (1.5x) for both mobile and desktop

        const container = containerRef.current;

        // Init
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);

        // Responsive camera positioning
        camera.position.set(0, 0, isMobile ? 180 : 230);

        const directionalLight = new THREE.DirectionalLight("#fff", 1);
        directionalLight.position.set(0, 50, -20);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight("#ffffff", 1);
        ambientLight.position.set(0, 20, 20);
        scene.add(ambientLight);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        clock = new THREE.Clock();

        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 4;
        controls.maxDistance = isMobile ? 250 : 350;
        controls.minDistance = isMobile ? 120 : 150;
        controls.enablePan = false;

        const loader = new THREE.TextureLoader();
        const textureSphereBg = loader.load('https://i.ibb.co/HC0vxMw/sky2.jpg');
        const textureNucleus = loader.load('https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg');
        const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
        const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");
        const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
        const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");

        // Logo (replacing nucleus)
        const logoTexture = loader.load('/public-relations.png'); // Replace with your logo path
        logoTexture.anisotropy = 16;
        logoTexture.minFilter = THREE.LinearFilter;
        logoTexture.magFilter = THREE.LinearFilter;
        logoTexture.generateMipmaps = false;

        // Create a plane for the logo
        // Responsive logo size based on screen size
        let logoSize;
        if (isMobile) {
            logoSize = 25;
        } else if (isTablet) {
            logoSize = 30;
        } else {
            logoSize = 38;
        }

        const logoGeometry = new THREE.PlaneGeometry(logoSize, logoSize);
        const logoMaterial = new THREE.MeshBasicMaterial({
            map: logoTexture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        nucleus = new THREE.Mesh(logoGeometry, logoMaterial);

        // Position logo at the exact geometric center of the whole sphere in 3D space
        // Since sphere is positioned at bottom, center is at sphere's geometric center
        const logoCenterOffset = baseSphereRadius * 0.5; // Center of whole sphere
        nucleus.position.set(0, -logoCenterOffset, 0); // x=0, y=center, z=0 for perfect 3D centering

        scene.add(nucleus);

        // Sphere background
        textureSphereBg.anisotropy = 16;
        const geometrySphereBg = new THREE.SphereGeometry(baseSphereRadius, 40, 40);
        const materialSphereBg = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: textureSphereBg });
        sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);

        // Position sphere at bottom - only 50% visible
        const sphereBottomOffset = baseSphereRadius * 0.5; // 50% of sphere below viewport
        sphereBg.position.set(0, -sphereBottomOffset, 0);

        scene.add(sphereBg);

        // Stars
        const starsPositions = [];
        const starsVelocities = [];
        const starsStartPositions = [];

        const starRadius = isMobile ? 80 : 150; // Smaller star field for mobile
        const starCount = isMobile ? 30 : 50; // Fewer stars for mobile

        for (let i = 0; i < starCount; i++) {
            let v = randomPointSphere(starRadius);
            starsPositions.push(v.x, v.y, v.z);
            const velocity = THREE.MathUtils.randInt(50, 200);
            starsVelocities.push(velocity);
            starsStartPositions.push(v.x, v.y, v.z);
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: isMobile ? 3 : 5, // Smaller stars for mobile
            color: "#ffffff",
            transparent: true,
            opacity: 0.8,
            map: textureStar,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Fixed stars
        const createStars = (texture, size, total) => {
            const positions = [];
            for (let i = 0; i < total; i++) {
                const v = randomPointSphere(THREE.MathUtils.randInt(70, 149));
                positions.push(v.x, v.y, v.z);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size,
                map: texture,
                blending: THREE.AdditiveBlending
            });

            return new THREE.Points(geometry, material);
        };

        scene.add(createStars(texture1, 15, 20));
        scene.add(createStars(texture2, 5, 5));
        scene.add(createStars(texture4, 7, 5));

        // Animate
        const limitFPS = (interval) => {
            requestAnimationFrame(() => limitFPS(interval));
            delta += clock.getDelta();
            if (delta > interval) {
                animate();
                delta %= interval;
            }
        };

        const animate = () => {
            const positions = stars.geometry.attributes.position.array;
            for (let i = 0; i < starCount; i++) {
                const index = i * 3;
                const velocity = starsVelocities[i];

                positions[index] += (0 - positions[index]) / velocity;
                positions[index + 1] += (0 - positions[index + 1]) / velocity;
                positions[index + 2] += (0 - positions[index + 2]) / velocity;
                starsVelocities[i] -= 0.3;

                if (Math.abs(positions[index]) <= 5 && Math.abs(positions[index + 2]) <= 5) {
                    positions[index] = starsStartPositions[index];
                    positions[index + 1] = starsStartPositions[index + 1];
                    positions[index + 2] = starsStartPositions[index + 2];
                    starsVelocities[i] = THREE.MathUtils.randInt(50, 300);
                }
            }

            stars.geometry.attributes.position.needsUpdate = true;

            // Logo always faces camera
            nucleus.lookAt(camera.position);

            // Responsive sphere and logo scaling based on scroll progress
            const currentIsMobile = window.innerWidth <= 768;
            const currentIsTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            const currentIsDesktop = window.innerWidth > 1024;

            // Responsive scaling based on screen size
            let currentMaxScale;
            if (currentIsMobile) {
                currentMaxScale = 0.6; // Mobile: scale down to 60%
            } else if (currentIsTablet) {
                currentMaxScale = 0.65; // Tablet: scale down to 65%
            } else {
                currentMaxScale = 0.6; // Desktop: scale down to 60%
            }

            const scaleFactor = 1 - (scrollProgressRef.current * (1 - currentMaxScale));

            // Scale both sphere and logo together
            sphereBg.scale.setScalar(scaleFactor);
            nucleus.scale.setScalar(scaleFactor);

            sphereBg.rotation.x += 0.002;
            sphereBg.rotation.y += 0.002;
            sphereBg.rotation.z += 0.002;

            controls.update();
            renderer.render(scene, camera);
        };

        limitFPS(1 / 60);

        const onWindowResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        const handleResize = () => {
            clearTimeout(timeoutDebounce);
            timeoutDebounce = setTimeout(onWindowResize, 80);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
        };

        function randomPointSphere(radius) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            return new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url("https://user-images.githubusercontent.com/26748614/96337246-f14d4580-1085-11eb-8793-a86d929e034d.jpg")',
                backgroundSize: 'cover',
                backdropFilter: 'brightness(50%)',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        >
        </div>
    );
};

export default StarfieldScene;
