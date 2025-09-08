"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function TokenList() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("/api/tokens")
        const data = await response.json()
        setTokens(data.tokens || [])
      } catch (error) {
        console.error("Failed to fetch tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-primary font-mono">Our Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-accent">Loading tokens...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-primary font-mono">Our Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tokens.slice(0, 3).map((token) => (
            <div
              key={token.mint}
              className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
            >
              <div className="flex items-center space-x-3">
                <img src={token.image_uri || "/placeholder.svg"} alt={token.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-primary font-medium">{token.symbol}</div>
                  <div className="text-accent text-sm">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary font-mono">${token.usd_market_cap?.toFixed(2) || "0.00"}</div>
                <Link
                  href={`https://pump.fun/${token.mint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-primary text-sm flex items-center space-x-1"
                >
                  <span>Trade</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
