
import "./globals.css"
import { ReactNode } from "react"

export const metadata = { title: "Heybassh Shell / Cloud", description: "Unified workspace" }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
