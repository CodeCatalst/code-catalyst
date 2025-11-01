import { useEffect, useRef } from 'react'

const NeuralWaveAnimation = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
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

    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        // Start from left side
        this.x = -50
        this.y = Math.random() * canvas.height
        this.z = Math.random() * 0.8 + 0.2 // Depth for perspective
        
        // Wave-like movement
        this.baseY = this.y
        this.waveOffset = Math.random() * Math.PI * 2
        this.waveAmplitude = 40 + Math.random() * 80
        this.waveFrequency = 0.001 + Math.random() * 0.002
        
        // Smoother speed with less variation
        this.speedX = (2 + Math.random() * 1.5) * this.z
        this.speedY = (Math.random() - 0.5) * 0.3
        
        // Color - purple, pink, or blue
        const colors = [
          { r: 168, g: 85, b: 247 },   // Purple
          { r: 236, g: 72, b: 153 },   // Pink
          { r: 59, g: 130, b: 246 }    // Blue
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        
        // Size based on depth
        this.size = (2.5 + Math.random() * 3) * this.z
        this.alpha = 0.5 + Math.random() * 0.5
        
        // Initialize current values
        this.currentAlpha = this.alpha
        this.currentSize = this.size
        
        // Pulse effect
        this.pulseSpeed = 0.001 + Math.random() * 0.002
        this.pulseOffset = Math.random() * Math.PI * 2
      }

      update(time) {
        // Move horizontally
        this.x += this.speedX
        
        // Smooth wave motion with multiple frequencies
        const wave1 = Math.sin(this.x * this.waveFrequency + this.waveOffset + time * 0.0008) * this.waveAmplitude
        const wave2 = Math.sin(this.x * this.waveFrequency * 0.5 + time * 0.0005) * (this.waveAmplitude * 0.3)
        this.y = this.baseY + wave1 + wave2
        
        // Smooth pulsing
        this.currentAlpha = this.alpha * (0.7 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3)
        this.currentSize = this.size * (0.85 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15)
        
        // Reset if off screen
        if (this.x > canvas.width + 50) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        
        // Enhanced glow effect
        ctx.shadowBlur = 20 * this.z
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`
        
        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`
        ctx.fill()
        
        // Inner glow
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentSize * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.currentAlpha * 0.6})`
        ctx.fill()
        
        ctx.restore()
      }
    }

    // Create particles
    const particleCount = 120
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
      // Spread them out initially
      particles[i].x = (Math.random() * canvas.width) - 50
    }

    // Draw connections between nearby particles (neural network effect)
    const drawConnections = () => {
      const maxDistance = 180

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4
            
            // Create gradient line
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

    // Animation loop
    let startTime = Date.now()
    const animate = () => {
      const currentTime = Date.now() - startTime
      
      // Clear canvas with smoother fade effect
      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw connections first (behind particles)
      drawConnections()
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(currentTime)
        particle.draw()
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 1,
        mixBlendMode: 'screen'
      }}
    />
  )
}

export default NeuralWaveAnimation
