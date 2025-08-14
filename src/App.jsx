import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { Model } from './Model'
import './App.css'

// Simple reduced motion hook
function useReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Create a shared state for scroll data
let globalScrollData = { offset: 0, range: 0 }

// Component inside Canvas to update scroll data
function ScrollDataUpdater() {
  const scroll = useScroll()
  
  useFrame(() => {
    if (scroll) {
      globalScrollData.offset = scroll.offset
      globalScrollData.range = scroll.range(0, 1)
    }
  })
  
  return null // This component renders nothing
}

// Debug component OUTSIDE Canvas that reads the global data
function DebugInfo() {
  const [scrollData, setScrollData] = React.useState({ offset: 0, range: 0 })
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setScrollData({ ...globalScrollData })
    }, 100) // Update every 100ms
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 100,
      border: '1px solid rgba(255,255,255,0.2)',
      fontFamily: 'monospace'
    }}>
      <div>Model: /ziggs.glb</div>
      <div>Status: ✅ Loaded</div>
      <div>Scroll: {(scrollData.offset * 100).toFixed(1)}%</div>
      <div>Range: {scrollData.range.toFixed(2)}</div>
    </div>
  )
}

// Wrapper component to handle scroll animations
function AnimatedModel() {
  const modelRef = useRef()
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (modelRef.current && scroll) {
      // Get scroll offset (0 to 1)
      const scrollOffset = scroll.offset
      
      // Rotate based on scroll - more visible rotation
      modelRef.current.rotation.y = scrollOffset * Math.PI * 8 // Increased from 4 to 8
      
      // Add vertical movement (bobbing)
      const hop = Math.sin(scrollOffset * Math.PI * 6) * 0.5 // Increased amplitude
      modelRef.current.position.y = hop
      
      // Scale effect - more dramatic
      const scale = 0.8 + Math.sin(scrollOffset * Math.PI * 2) * 0.3 // More dramatic scaling
      modelRef.current.scale.set(scale, scale, scale)
      
      // Add some swaying motion
      const sway = Math.sin(scrollOffset * Math.PI * 3) * 0.15 // Increased sway
      modelRef.current.rotation.z = sway
    }
  })

  return (
    <group ref={modelRef}>
      <Model scale={[1.5, 1.5, 1.5]} />
    </group>
  )
}

// Simple loading component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  const reduced = useReducedMotion()

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
    <div className="app-container">
      {/* Fixed Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          background: '#1e1e1e'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ScrollControls pages={3} damping={0.1}>
            {/* FIXED: Much more reasonable lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={1}
              castShadow
            />
            <pointLight position={[-5, 5, 5]} intensity={0.5} />
            
            {/* Your Ziggs model with animations */}
            <AnimatedModel />
            
            {/* Component to update global scroll data */}
            <ScrollDataUpdater />
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Debug info - OUTSIDE the Canvas */}
      <DebugInfo />

      {/* Scrollable Content */}
      <div className="scroll-content">
        {/* Section 1 */}
        <section className="section">
          <h1>Meet Ziggs</h1>
          <p>
            Ziggs is a yordle with a love for big explosions. Scroll to learn how he went from a 
            lonely inventor to Piltover's most notorious demolitions expert.
          </p>
        </section>

        {/* Section 2 */}
        <section className="section">
          <h2 style={{ color: '#FFD700' }}>The Spark</h2>
          <p>
            One late night in his workshop, Ziggs perfected the Hexplosive Charge. The device was 
            small, elegant, and packed with enough punch to level a city block. His maniacal laughter 
            echoed through the laboratory as sparks flew and beakers bubbled with dangerous concoctions.
          </p>
        </section>

        {/* Section 3 */}
        <section className="section">
          <h2 style={{ color: '#FF6B6B' }}>Going Pro</h2>
          <p>
            Armed with his arsenal of explosive devices, Ziggs joined forces with Heimerdinger to 
            defend Piltover Academy. His unorthodox methods and explosive personality made him both 
            a valuable ally and a constant source of property damage insurance claims.
          </p>
        </section>
      </div>
    </div>
  )
}
