import './globals.css'
import { Inter } from 'next/font/google'
import { metadata, viewport } from './metadata'

const inter = Inter({ subsets: ['latin'] })

export { metadata, viewport }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

