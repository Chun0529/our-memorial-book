import { useEffect, useRef } from 'react'

function drawHeart(ctx, x, y, size, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size, size)
  ctx.beginPath()
  ctx.moveTo(0, 0.35)
  ctx.bezierCurveTo(-0.7, -0.35, -1.15, 0.45, 0, 1.15)
  ctx.bezierCurveTo(1.15, 0.45, 0.7, -0.35, 0, 0.35)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

export default function MagicLayer() {
  const bgRef = useRef(null)
  const fxRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    const fx = fxRef.current
    const background = bg.getContext('2d')
    const sparks = fx.getContext('2d')
    let width = 0
    let height = 0
    let frame = 0
    const motes = []
    const bits = []
    let lastSpark = 0

    function resize() {
      const ratio = window.devicePixelRatio || 1
      width = Math.floor(window.innerWidth * ratio)
      height = Math.floor(window.innerHeight * ratio)
      for (const canvas of [bg, fx]) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = '100%'
        canvas.style.height = '100%'
      }
    }

    function makeMote(initial) {
      const rising = Math.random() > 0.35
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 10,
        radius: (rising ? 1.2 : 0.6) + Math.random() * 1.8,
        vy: rising ? -(0.15 + Math.random() * 0.45) : 0,
        vx: (Math.random() - 0.5) * 0.15,
        alpha: 0.25 + Math.random() * 0.55,
        twinkle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '232, 206, 150' : '214, 176, 230',
      }
    }

    function burst(x, y, count, hearts) {
      const ratio = window.devicePixelRatio || 1
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = (0.4 + Math.random() * 1.8) * ratio
        bits.push({
          x: x * ratio,
          y: y * ratio,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4 * ratio,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          size: (hearts ? 7 : 2) + Math.random() * 4,
          heart: hearts && Math.random() > 0.55,
          color: Math.random() > 0.5 ? 'rgba(255, 226, 160, 1)' : 'rgba(255, 170, 190, 1)',
        })
      }
      if (bits.length > 220) bits.splice(0, bits.length - 220)
    }

    function onMove(event) {
      const now = performance.now()
      if (now - lastSpark < 28) return
      lastSpark = now
      burst(event.clientX, event.clientY, 2, false)
    }

    function onClick(event) {
      burst(event.clientX, event.clientY, 14, true)
    }

    function draw() {
      background.clearRect(0, 0, width, height)
      for (const mote of motes) {
        mote.x += mote.vx
        mote.y += mote.vy
        mote.twinkle += 0.03
        if (mote.y < -12 || mote.x < -20 || mote.x > width + 20) {
          Object.assign(mote, makeMote(false))
        }
        const alpha = mote.alpha * (0.65 + Math.sin(mote.twinkle) * 0.35)
        background.beginPath()
        background.fillStyle = `rgba(${mote.color}, ${alpha})`
        background.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2)
        background.fill()
      }

      sparks.clearRect(0, 0, width, height)
      for (let i = bits.length - 1; i >= 0; i -= 1) {
        const bit = bits[i]
        bit.x += bit.vx
        bit.y += bit.vy
        bit.life -= bit.decay
        if (bit.life <= 0) {
          bits.splice(i, 1)
          continue
        }
        sparks.globalAlpha = Math.max(bit.life, 0)
        if (bit.heart) drawHeart(sparks, bit.x, bit.y, bit.size * bit.life, bit.color)
        else {
          sparks.fillStyle = bit.color
          sparks.beginPath()
          sparks.arc(bit.x, bit.y, bit.size * bit.life, 0, Math.PI * 2)
          sparks.fill()
        }
      }
      sparks.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    resize()
    for (let i = 0; i < 80; i += 1) motes.push(makeMote(true))
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onClick)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onClick)
    }
  }, [])

  return (
    <>
      <canvas ref={bgRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <canvas ref={fxRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
    </>
  )
}
