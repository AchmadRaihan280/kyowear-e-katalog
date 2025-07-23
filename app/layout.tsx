import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KYOWEAR | Premium Quality Products',
  description: 'Discover our exclusive collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}