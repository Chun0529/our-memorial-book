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

function memo(id, nickname, author, quote, message, date) {
  return { id, nickname, author, quote, message, date }
}

export const SEED_MEMOS = [
  memo(
    'seed-1',
    '星詠者',
    '莉莉安',
    QUOTES[0],
    '那天的夜空特別亮，我們把願望寫在同一頁。若你再次翻開，請記得我也在。',
    '01-10-2026',
  ),
  memo(
    'seed-2',
    '旅人',
    '艾倫',
    QUOTES[1],
    '橋邊的風很輕。我把你的名字放進口袋，走到下一座城時還會拿出來看看。',
    '01-18-2026',
  ),
  memo(
    'seed-3',
    '詠詩者',
    '蜜兒',
    QUOTES[2],
    '你說過喜歡金色的邊框。所以我把這句話嵌在這裡，像一枚不會褪色的印章。',
    '02-02-2026',
  ),
  memo(
    'seed-4',
    '守夜人',
    '克羅',
    QUOTES[3],
    '夜班結束時我總會回頭。燈還亮著就好，表示有人把今天好好留下了。',
    '02-14-2026',
  ),
  memo(
    'seed-5',
    '記錄官',
    '蘇菲',
    QUOTES[4],
    '檔案編號不必記住。記住我們笑出聲的那一下，就夠這本書發光。',
    '03-03-2026',
  ),
  memo(
    'seed-6',
    '旅人',
    '漢斯',
    QUOTES[2],
    '雨停的時候街道會發亮。我想你會喜歡那樣的路，所以我走慢了一點。',
    '03-21-2026',
  ),
  memo(
    'seed-7',
    '星詠者',
    '伊芙',
    QUOTES[0],
    '若星星會抄寫人間，希望它把你的名字寫在最暖的那一顆上面。',
    '04-09-2026',
  ),
  memo(
    'seed-8',
    '守夜人',
    '馬可',
    QUOTES[1],
    '我守過很多扇門。最捨不得關的，是寫著我們故事的這一扇。',
    '05-01-2026',
  ),
  memo(
    'seed-9',
    '詠詩者',
    '娜娜',
    QUOTES[4],
    '句子可以很短。就像我現在只想說：謝謝你來過，也謝謝你留下。',
    '06-16-2026',
  ),
  memo(
    'seed-10',
    '記錄官',
    '里歐',
    QUOTES[3],
    '這不是結局的註記，是下一章的空白。我先簽下名字，等你補上你的那一行。',
    '07-28-2026',
  ),
  memo(
    'seed-11',
    '旅人',
    '艾莎',
    QUOTES[1],
    '背包裡有一張舊地圖。你畫過的叉還在，我沿著它又走了一遍。',
    '09-04-2026',
  ),
  memo(
    'seed-12',
    '星詠者',
    '馮恩',
    QUOTES[0],
    '把今天折好。以後無論翻到哪一頁，都能聽見我們當時的聲音。',
    '10-31-2026',
  ),
]

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
  return readJson(MEMO_KEY, SEED_MEMOS)
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
