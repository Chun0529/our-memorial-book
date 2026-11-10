import { useState } from 'react'
import { playMagicClick, startBgm, stopBgm } from '../lib/audio'

function NoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.85a2.5 2.5 0 1 1-2-2.45V7.1l-6 1.2v10.2Z" />
    </svg>
  )
}

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)

  function toggle() {
    const next = !playing
    setPlaying(next)
    playMagicClick()
    if (next) startBgm()
    else stopBgm()
  }

  return (
    <button
      type="button"
      className={`music-fab${playing ? ' playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? '暫停背景音樂' : '播放背景音樂'}
    >
      <NoteIcon />
      <span>{playing ? '暫停' : '音樂'}</span>
    </button>
  )
}
