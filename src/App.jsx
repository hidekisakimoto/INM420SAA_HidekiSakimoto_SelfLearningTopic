import { useReducedMotion } from './useReducedMotion'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import ZiggsScroll from './ZiggsScroll'

export default function App() {
  const reduced = useReducedMotion()

  /* reduced-motion fallback */
  if (reduced) {
    return (
      <img
        src="/ziggs.png"
        alt="Ziggs static"
        style={{ width: '100%', height: '100vh', objectFit: 'contain' }}
      />
    )
  }

  /* full interactive version */
  return (
    <>
      {/*  Full-screen Canvas sits behind the HTML  */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ position: 'absolute', inset: 0, zIndex: -1 }}
      >
        <color attach="background" args={['#1e1e1e']} />

        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={10} />
        <Environment preset="city" environmentIntensity={1} />

        <Suspense fallback={null}>
          {/* 3 Drei-pages ≈ 300 vh of scroll distance */}
          <ScrollControls pages={3} damping={4} >
            <ZiggsScroll />

            {/*  Scroll-linked DOM overlay  */}
            <Scroll html>
              <section
                style={{
                  height: '300vh',
                  color: '#fff',
                  padding: '20vh 10vw',
                }}
              >
                <h1 style={{ fontSize: '4rem', margin: 0 }}>Meet Ziggs</h1>

                <p style={{ maxWidth: 600 }}>
                  Ziggs is a yordle with a love for big explosions. Scroll to learn
                  how he went from a lonely inventor to Piltover’s most notorious
                  demolitions expert.
                </p>

                <h2 style={{ marginTop: '120vh' }}>The Spark</h2>
                <p style={{ maxWidth: 600 }}>
                  One late night in his workshop, Ziggs perfected the Hexplosive Charge…
                </p>

                <h2 style={{ marginTop: '220vh' }}>Going Pro</h2>
                <p style={{ maxWidth: 600 }}>
                  Armed with his new bombs he teamed up with Heimerdinger to defend the Academy…
                </p>
              </section>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  )
}
