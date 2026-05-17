import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <body style={{ minHeight: '100vh', overflowY: 'auto' }}>{children}</body>
    </html>
  )
}
