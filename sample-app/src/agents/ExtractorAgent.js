/**
 * ExtractorAgent
 *
 * Receives a browser File object. For PDFs, uses pdf.js to iterate every page
 * and collect the raw text content. For any other file type it returns a
 * descriptive error so the downstream agents can surface a clear message.
 *
 * Returns: { filename, text, pageCount, error? }
 */

import * as pdfjsLib from 'pdfjs-dist'

// Point the worker at the pre-built ESM worker shipped with pdfjs-dist.
// Vite resolves the ?url suffix to a cache-busted asset URL automatically.
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export async function ExtractorAgent(file) {
  const filename = file.name

  if (file.type !== 'application/pdf' && !filename.toLowerCase().endsWith('.pdf')) {
    return {
      filename,
      text: '',
      pageCount: 0,
      error: `"${filename}" is not a PDF. Please upload a PDF contract.`,
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  const pageTexts = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pageTexts.push(pageText)
  }

  return {
    filename,
    text: pageTexts.join('\n'),
    pageCount: pdf.numPages,
  }
}
