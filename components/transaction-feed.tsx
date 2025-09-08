"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Activity, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TransactionFeed() {
  const { data, error } = useSWR("/api/transactions", fetcher, {
    refreshInterval: 5000,
  })
  const [copiedMints, setCopiedMints] = useState<Set<string>>(new Set())

  const transactions = data?.transactions || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const truncateAddress = (address: string) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyMintAddress = async (mint: string) => {
    try {
      await navigator.clipboard.writeText(mint)
      setCopiedMints((prev) => new Set(prev).add(mint))
      setTimeout(() => {
        setCopiedMints((prev) => {
          const newSet = new Set(prev)
          newSet.delete(mint)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy mint address:", err)
    }
  }

  return (
    <Card className="gradient-card slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-accent flex items-center gap-3">
          <Activity className="h-5 w-5" />
          Feed
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <div className="w-2 h-2 bg-accent rounded-full pulse-green mr-2"></div>
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {error && (
            <div className="p-6 text-center">
              <div className="text-destructive text-sm font-mono mb-2">⚠ Connection error</div>
              <div className="text-xs text-muted-foreground">Retrying connection...</div>
            </div>
          )}

          {transactions.length === 0 && !error && (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
              <div className="text-muted-foreground text-sm font-mono">Waiting for transactions...</div>
            </div>
          )}

          {transactions.map((tx: any, index: number) => (
            <div
              key={`${tx.id}-${tx.tx_sig}-${index}`}
              className="border-b border-border/50 last:border-b-0 p-4 hover:bg-accent/5 transition-all duration-300 hover:border-accent/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 capitalize">
                    {tx.action || "Buyback"}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{formatDate(tx.created_at)}</span>
                </div>
                <span className="text-sm text-accent font-mono font-semibold">
                  {(Number.parseFloat(tx.balance) || 0).toFixed(6)} SOL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-mono">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">Token Mint</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{truncateAddress(tx.mint)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent/20"
                      onClick={() => copyMintAddress(tx.mint)}
                    >
                      {copiedMints.has(tx.mint) ? (
                        <Check className="w-3 h-3 text-accent" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground hover:text-accent" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">SOL Used</span>
                  <span className="text-primary font-semibold">
                    {(Number.parseFloat(tx.sol_amount) || 0).toFixed(6)} SOL
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">Transaction</span>
                  <a
                    href={`https://solscan.io/tx/${tx.tx_sig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary transition-colors flex items-center gap-1 hover:underline"
                  >
                    Solscan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
