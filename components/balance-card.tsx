"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BalanceCard() {
  const { data, error } = useSWR("/api/balance", fetcher, {
    refreshInterval: 5000,
  })

  const balance = data?.balance || 0

  return (
    <Card className="gradient-card slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Wallet className="h-5 w-5 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-accent neon-text font-mono mb-2">
          {(Number.parseFloat(balance) || 0).toFixed(4)} SOL
        </div>
        <p className="text-sm text-muted-foreground">
          {error ? (
            <span className="text-destructive">⚠ Connection error</span>
          ) : (
            <span className="text-accent">● Real-time balance</span>
          )}
        </p>
        <div className="mt-3 text-xs text-muted-foreground font-mono">829KbRjUYwwdX93x83TL7RiQszmQ4g7vknHiLhBxZcmK</div>
      </CardContent>
    </Card>
  )
}
