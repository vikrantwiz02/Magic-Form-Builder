import './globals.css'
import { Poppins } from 'next/font/google'
import { metadata, viewport } from './metadata'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export { metadata, viewport }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}

