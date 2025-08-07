import { useReducedMotion } from './useReducedMotion'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import ZiggsScroll from './ZiggsScroll'

export default function App() {
  const reduced = useReducedMotion()

  return (
    <>
      <header
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {reduced ? (
          <img
            src="/ziggs.png"
            alt="Ziggs static"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <color attach="background" args={['#ffffff']} />

            {/* fill light */}
            <ambientLight intensity={1.2} />

            {/* keep the directional for a touch of shading */}
            <directionalLight position={[5, 5, 5]} intensity={20} />

            {/* NEW: image-based lighting */}
            <Environment preset="city" />

            <Suspense fallback={null}>
              <ScrollControls pages={2} damping={4}>
                <ZiggsScroll />
              </ScrollControls>
            </Suspense>
          </Canvas>
        )}
      </header>

      <section style={{ height: '150vh', padding: '4rem', maxWidth: 800 }}>
        <h2>Scroll more</h2>
        <p>
          Just filler text so the page is long enough. Replace this with real stuff later.
        </p>
      </section>
    </>
  )
}


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
