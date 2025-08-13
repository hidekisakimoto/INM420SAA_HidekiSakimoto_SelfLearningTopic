import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Simple reduced motion hook
function useReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Create Ziggs 3D model - now supports both GLB loading and fallback
async function createZiggsModel() {
  const group = new THREE.Group()
  
  try {
    // Import GLTFLoader dynamically
    const { GLTFLoader } = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js')
    
    const loader = new GLTFLoader()
    
    // Load the GLB file
    const gltf = await new Promise((resolve, reject) => {
      loader.load(
        '/ziggs.glb', // Make sure this file is in your public folder
        (gltf) => resolve(gltf),
        (progress) => console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%'),
        (error) => reject(error)
      )
    })
    
    // Get the model from the loaded GLTF
    const model = gltf.scene
    
    // Optional: Apply transformations to match your original Model.jsx settings
    model.position.set(-0.021, -0.01, 0)
    model.rotation.set(-Math.PI / 2, 0.044, 0)
    
    // Optional: Scale the model if needed
    model.scale.set(1, 1, 1)
    
    // Enable shadows if your model should cast/receive them
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    
    group.add(model)
    console.log('✅ Ziggs GLB model loaded successfully!')
    return group
    
  } catch (error) {
    console.warn('⚠️ Failed to load Ziggs GLB model, using fallback:', error)
    
    // Fallback: Create simple geometric model if GLB fails to load
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.8)
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    group.add(body)
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16)
    const headMaterial = new THREE.MeshStandardMaterial({ color: '#DEB887' })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.set(0, 0.9, 0)
    group.add(head)
    
    // Left eye
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8)
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: '#00FF00', 
      emissive: '#002200' 
    })
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.15, 1.1, 0.35)
    group.add(leftEye)
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone())
    rightEye.position.set(0.15, 1.1, 0.35)
    group.add(rightEye)
    
    // Goggles frame
    const gogglesGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 16)
    const gogglesMaterial = new THREE.MeshStandardMaterial({ color: '#8B0000' })
    const goggles = new THREE.Mesh(gogglesGeometry, gogglesMaterial)
    goggles.position.set(0, 1.1, 0.3)
    group.add(goggles)
    
    // Hat
    const hatGeometry = new THREE.ConeGeometry(0.3, 0.6, 8)
    const hatMaterial = new THREE.MeshStandardMaterial({ color: '#4169E1' })
    const hat = new THREE.Mesh(hatGeometry, hatMaterial)
    hat.position.set(0, 1.4, 0)
    hat.rotation.z = 0.2
    group.add(hat)
    
    return group
  }
}

// Main App Component
export default function App() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const ziggsModelRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#1e1e1e')
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 6)
    cameraRef.current = camera

    // Renderer setup with better performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = false // Disable shadows for better performance
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create and add Ziggs model (now async)
    createZiggsModel().then(ziggsModel => {
      ziggsModelRef.current = ziggsModel
      scene.add(ziggsModel)
      setIsModelLoaded(true)
      console.log('Model added to scene')
    }).catch(error => {
      console.error('Failed to create Ziggs model:', error)
    })

    // Optimized animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (ziggsModelRef.current && isModelLoaded) {
        // Rotate based on scroll (slower rotation for smoother performance)
        ziggsModelRef.current.rotation.y = scrollProgress * Math.PI * 2

        // Add vertical movement
        const hop = Math.sin(scrollProgress * Math.PI * 2) * 0.2
        ziggsModelRef.current.position.y = hop

        // Scale effect (less dramatic for better performance)
        const scale = 1 + Math.sin(scrollProgress * Math.PI) * 0.1
        ziggsModelRef.current.scale.set(scale, scale, scale)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [reduced, isModelLoaded]) // Remove scrollProgress from dependencies to prevent re-render

  // Handle scroll with throttling for better performance
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight))
          setScrollProgress(scrollPercent)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reduced motion fallback
  if (reduced) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: 0, marginBottom: '1rem' }}>Meet Ziggs</h1>
          <p style={{ fontSize: '1.2rem' }}>3D animations disabled due to motion preferences</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      minHeight: '300vh',
      backgroundColor: '#1e1e1e' // Ensure background color
    }}>
      {/* Fixed Three.js canvas */}
      <div 
        ref={mountRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0, // Changed from -1 to 0
          pointerEvents: 'none',
          backgroundColor: '#1e1e1e' // Fallback background
        }}
      />
      
      {/* Scrollable content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        minHeight: '300vh',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        pointerEvents: 'auto',
        background: 'transparent' // Make content background transparent
      }}>
        {/* Section 1 */}
        <section style={{
          height: '100vh',
          padding: '20vh 10vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: 'transparent'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 8vw, 4rem)', 
            margin: 0,
            marginBottom: '2rem',
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            fontWeight: 'bold',
            color: '#ffffff'
          }}>
            Meet Ziggs
          </h1>
          <p style={{ 
            maxWidth: '600px', 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.6,
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            opacity: 0.95,
            color: '#ffffff'
          }}>
            Ziggs is a yordle with a love for big explosions. Scroll to learn how he went from a 
            lonely inventor to Piltover's most notorious demolitions expert.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{
          height: '100vh',
          padding: '20vh 10vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: 'transparent'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            margin: 0,
            marginBottom: '2rem',
            color: '#FFD700',
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            fontWeight: 'bold'
          }}>
            The Spark
          </h2>
          <p style={{ 
            maxWidth: '600px',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.6,
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            opacity: 0.95,
            color: '#ffffff'
          }}>
            One late night in his workshop, Ziggs perfected the Hexplosive Charge. The device was 
            small, elegant, and packed with enough punch to level a city block. His maniacal laughter 
            echoed through the laboratory as sparks flew and beakers bubbled with dangerous concoctions.
          </p>
        </section>

        {/* Section 3 */}
        <section style={{
          height: '100vh',
          padding: '20vh 10vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: 'transparent'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            margin: 0,
            marginBottom: '2rem',
            color: '#FF6B6B',
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            fontWeight: 'bold'
          }}>
            Going Pro
          </h2>
          <p style={{ 
            maxWidth: '600px',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.6,
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            opacity: 0.95,
            color: '#ffffff'
          }}>
            Armed with his arsenal of explosive devices, Ziggs joined forces with Heimerdinger to 
            defend Piltover Academy. His unorthodox methods and explosive personality made him both 
            a valuable ally and a constant source of property damage insurance claims.
          </p>
        </section>

        {/* Debug scroll progress */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 10,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          Scroll: {Math.round(scrollProgress * 100)}%
        </div>
      </div>
    </div>
  )
}
