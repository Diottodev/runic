import { useEffect } from 'react'

/**
 * Tracks mouse position and writes --mx / --my CSS custom properties
 * on <html>. The cursor wine-glow effect is defined entirely in CSS
 * (dark body::before). No DOM nodes rendered — pure side-effect.
 */
export function CursorGlow() {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return null
}
