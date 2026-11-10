import { useMemo, useRef, useState } from 'react'
import MagicLayer from './components/MagicLayer'
import MusicToggle from './components/MusicToggle'
import RecordsPanel from './components/RecordsPanel'
import WritePanel from './components/WritePanel'
import KeepersPanel from './components/KeepersPanel'
import DetailModal from './components/DetailModal'
import {
  formatSignDate,
  loadEliminated,
  loadMemos,
  saveEliminated,
  saveMemos,
} from './lib/storage'
import { playMagicClick } from './lib/audio'
import { exportAsImage, exportAsPdf } from './lib/exportBook'

const TABS = [
  { id: 'records', label: '釋出的紀錄' },
  { id: 'write', label: '撰寫' },
  { id: 'keepers', label: '被留下的紀錄者' },
]

export default function App() {
  const bookRef = useRef(null)
  const [tab, setTab] = useState('records')
  const [memos, setMemos] = useState(() => loadMemos())
  const [eliminated, setEliminated] = useState(() => loadEliminated())
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  const authors = useMemo(() => {
    const names = []
    memos.forEach((memo) => {
      if (memo.author && !names.includes(memo.author)) names.push(memo.author)
    })
    return names
  }, [memos])

  function switchTab(next) {
    if (next === tab) return
    playMagicClick()
    setTab(next)
  }

  function addMemo(draft) {
    const entry = {
      id: crypto.randomUUID(),
      ...draft,
      date: formatSignDate(),
    }
    const next = [entry, ...memos]
    setMemos(next)
    saveMemos(next)
    setPage(0)
    setTab('records')
  }

  function addEliminated(name) {
    if (eliminated.includes(name)) return
    const next = [...eliminated, name]
    setEliminated(next)
    saveEliminated(next)
  }

  async function exportBook(kind) {
    if (!bookRef.current) return
    setExporting(true)
    setExportError('')
    playMagicClick()
    try {
      if (kind === 'image') await exportAsImage(bookRef.current, 'memorial-page')
      else await exportAsPdf(bookRef.current, 'memorial-page')
    } catch {
      setExportError('匯出失敗，請再試一次')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <MagicLayer />
      <div className="vignette pointer-events-none fixed inset-0 z-[1]" />
      <main className="relative z-10 flex min-h-screen items-start justify-center px-3 pt-4 pb-28 sm:px-5">
        <div className="book-shell">
          <div className="book-frame" ref={bookRef}>
            <div className="book-frame-inner">
              <div className="book-paper">
                <header>
                  <h1 className="book-title">我們的紀念冊</h1>
                  <p className="book-subtitle">OUR MEMORIAL BOOK</p>
                  <div className="ornament" aria-hidden="true">
                    ✦
                  </div>
                </header>
                <div className="tab-row export-hide" role="tablist">
                  {TABS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === item.id}
                      className={`tab-btn${tab === item.id ? ' active' : ''}`}
                      onClick={() => switchTab(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div key={tab} className="tab-panel">
                  {tab === 'records' && (
                    <RecordsPanel
                      memos={memos}
                      page={page}
                      onPage={setPage}
                      onOpen={setSelected}
                      onExportImage={() => exportBook('image')}
                      onExportPdf={() => exportBook('pdf')}
                      exporting={exporting}
                    />
                  )}
                  {tab === 'write' && <WritePanel onSubmit={addMemo} />}
                  {tab === 'keepers' && (
                    <KeepersPanel authors={authors} eliminated={eliminated} onAdd={addEliminated} />
                  )}
                </div>
                {exportError && <p className="form-error export-hide">{exportError}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <MusicToggle />
      {selected && <DetailModal memo={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
