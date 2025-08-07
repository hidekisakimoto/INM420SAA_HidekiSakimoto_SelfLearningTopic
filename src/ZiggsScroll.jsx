import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useScroll, Bounds } from '@react-three/drei'
import { Model } from './Model'

export default function ZiggsScroll() {
  const ref = useRef()
  const scroll = useScroll()

  useFrame(() => {
    if (!ref.current) return

    const spin = scroll.range(0, 0.25)            // 0-25 %
    ref.current.rotation.y = spin * Math.PI * 2

    const hop = scroll.curve(0.25, 0.5)           // 25-50 %
    ref.current.position.y = hop * 0.5

    const zoom = scroll.range(0.5, 1)             // 50-100 %
    ref.current.scale.setScalar(1 + zoom * 0.5)
  })

  return (
    <Bounds fit margin={1.2}>
      <Model ref={ref} />
    </Bounds>
  )
}
