'use client'

import { useState } from 'react'
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { v4 as uuidv4 } from 'uuid'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface Highlight {
  id: string
  pageIndex: number
  text: string
}

interface Props {
  fileUrl: string
}

export default function HighlightablePdfViewer({ fileUrl }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [highlights, setHighlights] = useState<Highlight[]>([])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    if (!selectedText || !selection?.anchorNode) return

    const pages = document.querySelectorAll('.rpv-core__page-layer')
    pages.forEach((page, index) => {
      if (page.contains(selection.anchorNode!)) {
        const newHighlight: Highlight = {
          id: uuidv4(),
          pageIndex: index,
          text: selectedText,
        }
        setHighlights((prev) => [...prev, newHighlight])
      }
    })

    selection.removeAllRanges()
  }

  return (
    <div onMouseUp={handleTextSelection} className="w-full h-[85vh] border rounded shadow">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          defaultScale={SpecialZoomLevel.PageFit}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  )
}
