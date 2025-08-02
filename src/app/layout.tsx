import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeetGPT - Reunião com IA',
  description: 'Um aplicativo para reuniões com IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className="dark-theme">
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  )
}
