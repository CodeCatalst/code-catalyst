import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NeuralWaveAnimation = () => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const threeContainerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const threeContainer = threeContainerRef.current
    if (!canvas || !threeContainer) return

    const ctx = canvas.getContext('2d')
    let canvasAnimationFrameId
    let particles = []

    // Set canvas size
    const resizeCanvas = () => {
      const section = canvas.parentElement
      if (!section) return
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Wait for canvas to have dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      return
    }

    // === THREE.JS BACKGROUND SETUP ===
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x1e1b4b, 1, 50)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 30
    camera.position.y = 10
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x1e1b4b, 1)
    threeContainer.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Particle wave geometry
    const particleCount = 15000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const color1 = new THREE.Color(0xa855f7) // Purple
    const color2 = new THREE.Color(0xec4899) // Pink
    const color3 = new THREE.Color(0x3b82f6) // Blue

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const radius = Math.random() * 50
      const angle = Math.random() * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = Math.random() * 30 - 15

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      const mixRatio = Math.random()
      let color
      if (mixRatio < 0.33) {
        color = color1
      } else if (mixRatio < 0.66) {
        color = color2
      } else {
        color = color3
      }

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      sizes[i] = Math.random() * 2 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

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
          
          float wave = sin(pos.x * 0.1 + time * 0.5) * cos(pos.z * 0.1 + time * 0.3) * 2.0;
          pos.y += wave;
          
          float angle = time * 0.2;
          float cosA = cos(angle);
          float sinA = sin(angle);
          float x = pos.x * cosA - pos.z * sinA;
          float z = pos.x * sinA + pos.z * cosA;
          pos.x = x;
          pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          
          vAlpha = 1.0 - (length(mvPosition.xyz) / 50.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 2.0);
          
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
    })

    const threeParticles = new THREE.Points(geometry, material)
    scene.add(threeParticles)

    const createLightWave = (color, position) => {
      const light = new THREE.PointLight(color, 2, 100)
      light.position.set(...position)
      scene.add(light)
      return light
    }

    const lights = [
      createLightWave(0xa855f7, [20, 10, 20]),
      createLightWave(0xec4899, [-20, 10, -20]),
      createLightWave(0x3b82f6, [0, -10, 30])
    ]

    // === CANVAS NEURAL NETWORK SETUP ===
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = -50
        this.y = Math.random() * canvas.height
        this.z = Math.random() * 0.8 + 0.2
        
        this.baseY = this.y
        this.waveOffset = Math.random() * Math.PI * 2
        this.waveAmplitude = 40 + Math.random() * 80
        this.waveFrequency = 0.001 + Math.random() * 0.002
        
        this.speedX = (2 + Math.random() * 1.5) * this.z
        this.speedY = (Math.random() - 0.5) * 0.3
        
        const colors = [
          { r: 168, g: 85, b: 247 },
          { r: 236, g: 72, b: 153 },
          { r: 59, g: 130, b: 246 }
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        
        this.size = (2.5 + Math.random() * 3) * this.z
        this.alpha = 0.5 + Math.random() * 0.5
        
        this.currentAlpha = this.alpha
        this.currentSize = this.size
        
        this.pulseSpeed = 0.001 + Math.random() * 0.002
        this.pulseOffset = Math.random() * Math.PI * 2
      }

      update(time) {
        this.x += this.speedX
        
        const wave1 = Math.sin(this.x * this.waveFrequency + this.waveOffset + time * 0.0008) * this.waveAmplitude
        const wave2 = Math.sin(this.x * this.waveFrequency * 0.5 + time * 0.0005) * (this.waveAmplitude * 0.3)
        this.y = this.baseY + wave1 + wave2
        
        this.currentAlpha = this.alpha * (0.7 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3)
        this.currentSize = this.size * (0.85 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15)
        
        if (this.x > canvas.width + 50) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        
        ctx.shadowBlur = 20 * this.z
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`
        ctx.fill()
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentSize * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.currentAlpha * 0.6})`
        ctx.fill()
        
        ctx.restore()
      }
    }

    const particleCount2D = 120
    for (let i = 0; i < particleCount2D; i++) {
      particles.push(new Particle())
      particles[i].x = (Math.random() * canvas.width) - 50
    }

    const drawConnections = () => {
      const maxDistance = 180

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4
            
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            
            gradient.addColorStop(0, `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${opacity * particles[i].currentAlpha})`)
            gradient.addColorStop(1, `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${opacity * particles[j].currentAlpha})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // === COMBINED ANIMATION LOOP ===
    let startTime = Date.now()
    let threeTime = 0
    
    const animate = () => {
      const currentTime = Date.now() - startTime
      threeTime += 0.005

      // Update Three.js scene
      material.uniforms.time.value = threeTime

      camera.position.x = Math.sin(threeTime * 0.1) * 5
      camera.position.y = 10 + Math.cos(threeTime * 0.15) * 3
      camera.lookAt(0, 0, 0)

      lights.forEach((light, i) => {
        const angle = threeTime * (0.2 + i * 0.1)
        const radius = 25
        light.position.x = Math.cos(angle) * radius
        light.position.z = Math.sin(angle) * radius
        light.position.y = 10 + Math.sin(threeTime * 0.5 + i) * 5
      })

      renderer.render(scene, camera)

      // Update Canvas neural network
      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      drawConnections()
      
      particles.forEach(particle => {
        particle.update(currentTime)
        particle.draw()
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (threeContainer && renderer.domElement) {
        threeContainer.removeChild(renderer.domElement)
      }

      geometry.dispose()
      material.dispose()
      renderer.dispose()

      lights.forEach(light => scene.remove(light))
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
        }}
      />
      {/* Canvas Neural Network Overlay */}
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}

export default NeuralWaveAnimation
