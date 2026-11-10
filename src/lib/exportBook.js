function prepareClone(doc) {
  doc.querySelectorAll('.export-hide').forEach((node) => {
    node.style.display = 'none'
  })
  doc.querySelectorAll('.book-paper').forEach((node) => {
    node.style.maxHeight = 'none'
    node.style.overflow = 'visible'
  })
  doc.querySelectorAll('style').forEach((style) => {
    if (!style.textContent) return
    style.textContent = style.textContent
      .replace(/oklch\([^;{}]*\)/g, 'rgb(58, 42, 34)')
      .replace(/oklab\([^;{}]*\)/g, 'rgb(58, 42, 34)')
      .replace(/color-mix\([^;{}]*\)/g, 'rgb(58, 42, 34)')
  })
}

async function capture(element) {
  const { default: html2canvas } = await import('html2canvas')
  return html2canvas(element, {
    scale: 2,
    backgroundColor: '#FBF6EC',
    useCORS: true,
    onclone: prepareClone,
  })
}

function stampName(prefix, extension) {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  return `${prefix}-${stamp}.${extension}`
}

export async function exportAsImage(element, prefix) {
  const canvas = await capture(element)
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = stampName(prefix, 'png')
  link.click()
}

export async function exportAsPdf(element, prefix) {
  const canvas = await capture(element)
  const image = canvas.toDataURL('image/jpeg', 0.92)
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
    hotfixes: ['px_scaling'],
  })
  pdf.addImage(image, 'JPEG', 0, 0, canvas.width, canvas.height)
  pdf.save(stampName(prefix, 'pdf'))
}
