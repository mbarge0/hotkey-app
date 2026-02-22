import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HotKey - Content Review',
  description: 'Review and schedule content from your HotKey captures',
  icons: {
    icon: [
      { url: '/review/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
