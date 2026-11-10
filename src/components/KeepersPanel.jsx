import { useState } from 'react'
import { playMagicClick } from '../lib/audio'

export default function KeepersPanel({ authors, eliminated, onAdd }) {
  const [name, setName] = useState('')

  function submit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    playMagicClick()
    onAdd(trimmed)
    setName('')
  }

  return (
    <div className="keeper-grid">
      <label className="keeper-box">
        <span className="field-label">被留下的紀錄者</span>
        <textarea className="field" readOnly value={authors.join('\n')} />
      </label>
      <div className="keeper-box">
        <label>
          <span className="field-label">出局紀錄者</span>
          <textarea className="field" readOnly value={eliminated.join('\n')} />
        </label>
        <form className="keeper-add" onSubmit={submit}>
          <input
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="輸入出局紀錄者名稱"
            maxLength={24}
          />
          <button type="submit" className="btn-crimson">
            加入
          </button>
        </form>
      </div>
    </div>
  )
}
