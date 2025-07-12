// components/PdfViewer.tsx
interface PdfViewerProps {
  fileUrl: string
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  return (
    <iframe
      src={fileUrl}
      width="100%"
      height="800px"
      style={{ border: 'none' }}
      title="PDF Viewer"
    />
  )
}
