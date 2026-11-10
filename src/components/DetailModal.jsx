import { useEffect, useState } from 'react'
import { playMagicClick } from '../lib/audio'
import { exportAsImage, exportAsPdf } from '../lib/exportBook'

export default function DetailModal({ memo, onClose }) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function run(kind) {
    const sheet = document.getElementById('detail-sheet')
    if (!sheet) return
    setExporting(true)
    setError('')
    playMagicClick()
    try {
      if (kind === 'image') await exportAsImage(sheet, 'memorial-card')
      else await exportAsPdf(sheet, 'memorial-card')
    } catch {
      setError('匯出失敗，請再試一次')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        playMagicClick()
        onClose()
      }}
    >
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="book-frame" id="detail-sheet">
          <div className="book-frame-inner">
            <article className="book-paper detail-sheet">
              <p className="detail-kicker">OUR MEMORIAL BOOK</p>
              <h3 className="detail-quote">「{memo.quote}」</h3>
              <p className="detail-message">{memo.message}</p>
              <div className="detail-sign">
                <strong>{memo.author}</strong>
                {memo.nickname ? <em>{memo.nickname}</em> : null}
                <p className="memo-date">Last Sign on {memo.date}</p>
              </div>
            </article>
          </div>
        </div>
        <div className="modal-actions">
          <span className="form-error">{error}</span>
          <button type="button" className="btn-ghost" onClick={() => run('image')} disabled={exporting}>
            匯出圖片
          </button>
          <button type="button" className="btn-ghost" onClick={() => run('pdf')} disabled={exporting}>
            匯出 PDF
          </button>
          <button
            type="button"
            className="btn-crimson"
            onClick={() => {
              playMagicClick()
              onClose()
            }}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  )
}
