import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { Model } from './Model'

export default function ZiggsScroll() {
  const ref = useRef()
  const scroll = useScroll()   // gives scroll data 0 → 1

  useFrame(() => {
    // Simple spin based on scroll position
    if (ref.current) {
      const r = scroll.offset * Math.PI * 2   // full turn by bottom
      ref.current.rotation.y = r
      ref.current.rotation.x = r * 0.25       // slight tilt for fun
    }
  })

  return <Model ref={ref} scale={1.5} />
}
