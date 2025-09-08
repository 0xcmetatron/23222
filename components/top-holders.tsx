"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp } from "lucide-react"

interface TopHolder {
  address: string
  uiAmount: number
  uiAmountString: string
}

export function TopHolders() {
  const [holders, setHolders] = useState<TopHolder[]>([])
  const [loading, setLoading] = useState(true)
  const [latestMint, setLatestMint] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get the latest mint
        const tokensResponse = await fetch("/api/pump-tokens")
        const tokensData = await tokensResponse.json()

        if (tokensData.coins && tokensData.coins.length > 0) {
          const mint = tokensData.coins[0].mint
          setLatestMint(mint)

          // Then get top holders for that mint
          const holdersResponse = await fetch(`/api/top-holders?mint=${mint}`)
          const holdersData = await holdersResponse.json()

          if (holdersData.topHolders?.value) {
            // Filter out holders with 0 amount and take top 10
            const validHolders = holdersData.topHolders.value
              .filter((holder: TopHolder) => holder.uiAmount > 0)
              .slice(0, 10)
            setHolders(validHolders)
          }
        }
      } catch (error) {
        console.error("Failed to fetch top holders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatAmount = (amount: number) => {
    const numAmount = Number.parseFloat(amount) || 0
    if (numAmount >= 1000000) {
      return `${(numAmount / 1000000).toFixed(2)}M`
    } else if (numAmount >= 1000) {
      return `${(numAmount / 1000).toFixed(2)}K`
    }
    return numAmount.toFixed(2)
  }

  if (loading) {
    return (
      <Card className="gradient-card slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-accent">
            <Users className="w-5 h-5" />
            <span>Top Holders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card slide-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-accent">
            <Users className="w-5 h-5" />
            <span>Top Holders</span>
          </div>
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {holders.length > 0 ? (
            holders.map((holder, index) => (
              <div
                key={holder.address}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-accent/20 text-accent border-accent"
                        : index === 1
                          ? "bg-primary/20 text-primary border-primary"
                          : index === 2
                            ? "bg-chart-5/20 text-chart-5 border-chart-5"
                            : "bg-muted/20 text-muted-foreground border-muted"
                    }`}
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-mono text-sm text-foreground">{formatAddress(holder.address)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">{formatAmount(holder.uiAmount)}</p>
                  <p className="text-xs text-muted-foreground">tokens</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No holders data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
