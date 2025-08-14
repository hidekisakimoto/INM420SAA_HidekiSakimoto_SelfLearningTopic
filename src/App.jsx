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
    }, 16) // Update every frame (~60fps)
    
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
      modelRef.current.rotation.y = scrollOffset * Math.PI * 8
      
      // Add vertical movement (bobbing)
      const hop = Math.sin(scrollOffset * Math.PI * 6) * 0.5
      modelRef.current.position.y = hop
      
      // Scale effect - more dramatic
      const scale = 0.8 + Math.sin(scrollOffset * Math.PI * 2) * 0.3
      modelRef.current.scale.set(scale, scale, scale)
      
      // Add some swaying motion
      const sway = Math.sin(scrollOffset * Math.PI * 3) * 0.15
      modelRef.current.rotation.z = sway
      
      // Add some rotation on X axis for more dynamic movement
      modelRef.current.rotation.x = Math.sin(scrollOffset * Math.PI * 4) * 0.1
    }
  })

  return (
    <group ref={modelRef}>
      <Model scale={[1.5, 1.5, 1.5]} />
    </group>
  )
}

// Text overlay that moves with scroll
function ScrollContent() {
  const scroll = useScroll()
  
  return (
    <group>
      {/* We'll put text elements here if needed, but for now keep it simple */}
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
    <>
      {/* Debug info - OUTSIDE the Canvas */}
      <DebugInfo />
      
      {/* Full screen Canvas with ScrollControls */}
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
          {/* ScrollControls handles all the scrolling */}
          <ScrollControls 
            pages={3} 
            damping={0.1}
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            {/* Lighting */}
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
            
            {/* Scroll content */}
            <ScrollContent />
          </ScrollControls>
        </Suspense>
      </Canvas>
      
      {/* HTML content overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '300vh', // 3 pages
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {/* Section 1 */}
        <div style={{
          position: 'absolute',
          top: '0vh',
          left: '5%',
          width: '90%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <h1 style={{
            color: 'white',
            margin: '0 0 1rem 0',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
          }}>Meet Ziggs</h1>
          <p style={{
            color: 'white',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: '1.6',
            maxWidth: '600px',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
          }}>
            Ziggs is a yordle with a love for big explosions. Scroll to learn how he went from a 
            lonely inventor to Piltover's most notorious demolitions expert.
          </p>
        </div>

        {/* Section 2 */}
        <div style={{
          position: 'absolute',
          top: '100vh',
          left: '5%',
          width: '90%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <h2 style={{
            color: '#FFD700',
            margin: '0 0 1rem 0',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
          }}>The Spark</h2>
          <p style={{
            color: 'white',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: '1.6',
            maxWidth: '600px',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
          }}>
            One late night in his workshop, Ziggs perfected the Hexplosive Charge. The device was 
            small, elegant, and packed with enough punch to level a city block. His maniacal laughter 
            echoed through the laboratory as sparks flew and beakers bubbled with dangerous concoctions.
          </p>
        </div>

        {/* Section 3 */}
        <div style={{
          position: 'absolute',
          top: '200vh',
          left: '5%',
          width: '90%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <h2 style={{
            color: '#FF6B6B',
            margin: '0 0 1rem 0',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
          }}>Going Pro</h2>
          <p style={{
            color: 'white',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: '1.6',
            maxWidth: '600px',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
          }}>
            Armed with his arsenal of explosive devices, Ziggs joined forces with Heimerdinger to 
            defend Piltover Academy. His unorthodox methods and explosive personality made him both 
            a valuable ally and a constant source of property damage insurance claims.
          </p>
        </div>
      </div>
    </>
  )
}