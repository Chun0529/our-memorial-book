import { useState } from 'react'
import { QUOTES } from '../lib/storage'
import { playMagicClick } from '../lib/audio'

const LIMIT = 100

export default function WritePanel({ onSubmit }) {
  const [author, setAuthor] = useState('')
  const [quoteChoice, setQuoteChoice] = useState('')
  const [quote, setQuote] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function chooseQuote(value) {
    setQuoteChoice(value)
    setQuote(value === 'custom' ? '' : value)
  }

  function submit(event) {
    event.preventDefault()
    const nextAuthor = author.trim()
    const nextQuote = quote.trim()
    const nextMessage = message.trim()
    if (!nextAuthor || !nextQuote || !nextMessage) {
      setError('請填寫所有欄位')
      return
    }
    if (nextMessage.length > LIMIT) {
      setError('想說的話請控制在 100 字以內')
      return
    }
    setError('')
    playMagicClick()
    onSubmit({ author: nextAuthor, quote: nextQuote, message: nextMessage })
    setAuthor('')
    setQuoteChoice('')
    setQuote('')
    setMessage('')
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        <span className="field-label">撰寫玩家</span>
        <input
          className="field"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="請輸入玩家名稱，例如：哈利波特"
          maxLength={24}
        />
      </label>
      <label>
        <span className="field-label">請選擇金句</span>
        <select className="field" value={quoteChoice} onChange={(event) => chooseQuote(event.target.value)}>
          <option value="">請選擇金句</option>
          {QUOTES.map((line) => (
            <option key={line} value={line}>
              {line}
            </option>
          ))}
          <option value="custom">自己寫一句</option>
        </select>
      </label>
      <label>
        <span className="field-label">金句內容</span>
        <input
          className="field"
          value={quote}
          onChange={(event) => {
            setQuote(event.target.value)
            setQuoteChoice(QUOTES.includes(event.target.value) ? event.target.value : 'custom')
          }}
          placeholder="可直接修改或輸入金句"
          maxLength={40}
        />
      </label>
      <label>
        <span className="field-label">想說的話</span>
        <textarea
          className="field"
          rows={5}
          value={message}
          maxLength={LIMIT}
          onChange={(event) => setMessage(event.target.value.slice(0, LIMIT))}
          placeholder="把想留下的話寫在這裡"
        />
      </label>
      <div className="form-foot">
        <p className="form-error">{error}</p>
        <span className="counter">{message.length} / {LIMIT}</span>
      </div>
      <div className="form-foot">
        <span />
        <button type="submit" className="btn-crimson">
          發送金句
        </button>
      </div>
    </form>
  )
}
