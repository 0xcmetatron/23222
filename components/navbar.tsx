"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { config } from "@/lib/config.js"
import { useState, useEffect } from "react"

export function Navbar() {
  const [latestMint, setLatestMint] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestToken = async () => {
      try {
        const response = await fetch("/api/pump-tokens")
        const data = await response.json()
        if (data.coins && data.coins.length > 0) {
          setLatestMint(data.coins[0].mint)
        }
      } catch (error) {
        console.error("Failed to fetch latest token:", error)
      }
    }

    fetchLatestToken()
  }, [])

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full pulse-green"></div>
            <h1 className="text-2xl font-bold text-accent neon-text font-mono tracking-wider">{config.app.title}</h1>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href={
                latestMint
                  ? `https://pump.fun/coin/${latestMint}`
                  : "https://pump.fun/coin/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-accent-foreground hover:text-primary-foreground transition-all duration-300 bg-gradient-to-r from-accent to-primary px-4 py-2 rounded-lg border border-accent/30 hover:border-accent/60 terminal-glow hover:scale-105"
            >
              <span className="text-sm font-semibold">Buy Token</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              href={config.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-110"
            >
              <span className="text-sm font-medium">Follow us</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
