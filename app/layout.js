import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Scholizare',
  description: 'Your next door learning destination',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
           
      <head> <script src="https://apis.google.com/js/api.js"></script></head>

      <body className={inter.className}>{children}</body>
    </html>
  )
}
