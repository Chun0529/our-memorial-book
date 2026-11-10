let ctx = null
let master = null
let bgm = null

function ensure() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    ctx = new AudioCtx()
    master = ctx.createGain()
    master.gain.value = 0.85
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, delay = 0, attack = 0.02, release = 0.55, gain = 0.16, type = 'sine' }) {
  const audio = ensure()
  const now = audio.currentTime + delay
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + release)
  amp.gain.setValueAtTime(0.0001, now)
  amp.gain.exponentialRampToValueAtTime(gain, now + attack)
  amp.gain.exponentialRampToValueAtTime(0.0001, now + release)
  osc.connect(amp)
  amp.connect(master)
  osc.start(now)
  osc.stop(now + release + 0.05)
}

export function playMagicClick() {
  tone({ freq: 784, delay: 0, release: 0.42, gain: 0.14 })
  tone({ freq: 1175, delay: 0.05, release: 0.48, gain: 0.12 })
  tone({ freq: 1568, delay: 0.1, release: 0.55, gain: 0.1 })
  tone({ freq: 2093, delay: 0.16, release: 0.7, gain: 0.08 })

  const audio = ensure()
  const now = audio.currentTime
  const duration = 0.18
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * duration), audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  const noise = audio.createBufferSource()
  const filter = audio.createBiquadFilter()
  const amp = audio.createGain()
  noise.buffer = buffer
  filter.type = 'highpass'
  filter.frequency.value = 3800
  amp.gain.setValueAtTime(0.045, now)
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  noise.connect(filter)
  filter.connect(amp)
  amp.connect(master)
  noise.start(now)
  noise.stop(now + duration)
}

function stopNodes(nodes) {
  nodes.forEach((node) => {
    try {
      node.stop()
    } catch {
      /* already stopped */
    }
  })
}

export function startBgm() {
  const audio = ensure()
  if (bgm) return

  const pad = audio.createGain()
  pad.gain.setValueAtTime(0.0001, audio.currentTime)
  pad.gain.exponentialRampToValueAtTime(0.28, audio.currentTime + 1.1)
  pad.connect(master)

  const voices = [110, 164.81, 220, 261.63, 329.63].map((freq, index) => {
    const osc = audio.createOscillator()
    const amp = audio.createGain()
    osc.type = index % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.value = freq
    amp.gain.value = index > 2 ? 0.035 : 0.05
    osc.connect(amp)
    amp.connect(pad)
    osc.start()
    return osc
  })

  let step = 0
  const timer = window.setInterval(() => {
    if (!bgm) return
    step += 1
    const level = 0.24 + Math.sin(step / 3) * 0.04
    pad.gain.setTargetAtTime(level, audio.currentTime, 0.4)
    if (step % 4 === 0) {
      tone({ freq: 1318.5, gain: 0.035, attack: 0.04, release: 1.5 })
      tone({ freq: 1568, delay: 0.22, gain: 0.028, attack: 0.04, release: 1.6 })
    }
  }, 1400)

  bgm = { pad, voices, timer }
}

export function stopBgm() {
  if (!bgm || !ctx) return
  const current = bgm
  bgm = null
  window.clearInterval(current.timer)
  const now = ctx.currentTime
  current.pad.gain.cancelScheduledValues(now)
  current.pad.gain.setValueAtTime(Math.max(current.pad.gain.value, 0.0001), now)
  current.pad.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
  window.setTimeout(() => stopNodes(current.voices), 500)
}

export function isBgmPlaying() {
  return Boolean(bgm)
}
