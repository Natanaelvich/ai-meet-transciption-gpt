export const metadata = {
  title: 'MeetGPT - Reunião com IA',
  description: 'Um aplicativo para reuniões com IA',
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
