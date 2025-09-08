"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(0)
  const { data } = useSWR("/api/config", fetcher, {
    refreshInterval: 10000,
  })

  useEffect(() => {
    if (!data) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const lastRun = new Date(data.last_run).getTime()
      const cycleMs = data.cycle_seconds * 1000
      const nextRun = lastRun + cycleMs
      const remaining = Math.max(0, nextRun - now)
      setTimeLeft(Math.floor(remaining / 1000))
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [data])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="terminal-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Next Buyback</CardTitle>
        <Clock className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        {timeLeft === 0 ? (
          <div className="text-2xl font-bold text-primary font-mono animate-pulse">REBUY TOKENS</div>
        ) : (
          <div className="text-2xl font-bold text-accent font-mono">{formatTime(timeLeft)}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {timeLeft === 0 ? "Initiating rebuy cycle..." : "Time remaining"}
        </p>
      </CardContent>
    </Card>
  )
}
