export const NICKNAMES = ['旅人', '記錄官', '星詠者', '守夜人', '詠詩者']

export const QUOTES = [
  '願星光記得我們走過的路',
  '有些名字，會留在風裡',
  '今夜的火光，明日仍會溫暖',
  '我們把故事折進書頁',
  '離別不是終點，是另一頁的開始',
]

const MEMO_KEY = 'memorial-book-memos'
const OUT_KEY = 'memorial-book-out'

export const SEED_ELIMINATED = ['夜鶯', '未歸的旅人']

export function formatSignDate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}-${date.getFullYear()}`
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* keep the fallback copy */
  }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

export function loadMemos() {
  const stored = readJson(MEMO_KEY, [])
  const memos = stored.filter((memo) => !String(memo.id).startsWith('seed-'))
  if (memos.length !== stored.length) saveMemos(memos)
  return memos
}

export function saveMemos(memos) {
  localStorage.setItem(MEMO_KEY, JSON.stringify(memos))
}

export function loadEliminated() {
  return readJson(OUT_KEY, SEED_ELIMINATED)
}

export function saveEliminated(names) {
  localStorage.setItem(OUT_KEY, JSON.stringify(names))
}
