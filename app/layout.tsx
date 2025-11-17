
import "./globals.css"
import { ReactNode } from "react"
import Image from "next/image"
import logo from "../Images/heybasshlogo.png"

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
        <header className="fixed left-4 top-4 z-50">
          <a href="/" aria-label="Heybassh Home" className="inline-flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-black/80 p-1 shadow-md">
              <Image
                src={logo}
                alt="Heybassh"
                className="h-8 w-auto"
                height={32}
                priority
              />
            </span>
          </a>
        </header>
        {children}
      </body>
    </html>
  )
}
