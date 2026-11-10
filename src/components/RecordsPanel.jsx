import { playMagicClick } from '../lib/audio'

const PAGE_SIZE = 6

export default function RecordsPanel({ memos, page, onPage, onOpen, onExportImage, onExportPdf, exporting }) {
  const totalPages = Math.max(1, Math.ceil(memos.length / PAGE_SIZE))
  const current = Math.min(page, totalPages - 1)
  const visible = memos.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  function changePage(next) {
    playMagicClick()
    onPage(next)
  }

  return (
    <section>
      <div className="toolbar export-hide">
        <button type="button" className="btn-ghost" onClick={onExportImage} disabled={exporting}>
          {exporting ? '製作中…' : '匯出圖片'}
        </button>
        <button type="button" className="btn-ghost" onClick={onExportPdf} disabled={exporting}>
          {exporting ? '製作中…' : '匯出 PDF'}
        </button>
      </div>
      {memos.length === 0 ? (
        <p className="empty-records">還沒有釋出的紀錄。</p>
      ) : (
        <div className="memo-grid">
          {visible.map((memo) => (
            <button
              key={memo.id}
              type="button"
              className="memo-card"
              onClick={() => {
                playMagicClick()
                onOpen(memo)
              }}
            >
              {memo.nickname ? <span className="memo-nick">{memo.nickname}</span> : null}
              <span className="memo-author">{memo.author}</span>
              <p className="memo-message">{memo.message}</p>
              <p className="memo-date">Last Sign on {memo.date}</p>
            </button>
          ))}
        </div>
      )}
      {memos.length > 0 && (
        <div className="pager export-hide">
          <button
            type="button"
            className="page-btn"
            onClick={() => changePage(current - 1)}
            disabled={current === 0}
          >
            {'< 上一頁'}
          </button>
          <span className="page-count">
            {current + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="page-btn"
            onClick={() => changePage(current + 1)}
            disabled={current >= totalPages - 1}
          >
            {'下一頁 >'}
          </button>
        </div>
      )}
    </section>
  )
}
