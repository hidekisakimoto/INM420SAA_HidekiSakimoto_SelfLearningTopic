import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefers, setPrefers] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefers(media.matches)
    const handler = () => setPrefers(media.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return prefers
}
