
import "./globals.css"
import { ReactNode } from "react"
import Providers from "./providers"

export const metadata = { 
  title: "Heybassh Shell / Cloud", 
  description: "Unified workspace",
  icons: {
    icon: "/heybasshlogo.png",
    shortcut: "/heybasshlogo.png",
    apple: "/heybasshlogo.png",
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
