import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Advanced Form Builder',
  description: 'Create dynamic forms with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="background-animation">
          <div className="gradient-ball gradient-ball-1"></div>
          <div className="gradient-ball gradient-ball-2"></div>
          <div className="gradient-ball gradient-ball-3"></div>
        </div>
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}

