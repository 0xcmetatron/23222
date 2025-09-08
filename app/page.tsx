import { Navbar } from "@/components/navbar"
import { BalanceCard } from "@/components/balance-card"
import { Countdown } from "@/components/countdown"
import { TransactionFeed } from "@/components/transaction-feed"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 fade-in">
          <h2 className="text-4xl font-bold text-accent neon-text mb-4">
            BuyBack & Burn Terminal
          </h2>
          <p className="text-xl text-primary font-semibold mb-2">
            100% of Fees Used for Buyback & Burn
          </p>
          <p className="text-muted-foreground">
            Real-time monitoring of token buybacks & Burn
          </p>
        </div>

        {/* Cards centradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-center">
          <BalanceCard />
          <Countdown />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TransactionFeed />
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-mono">
          <p className="mb-2">© 2025 BuyBack & Burn Terminal</p>
          <p className="text-xs">Powered by BuyBack & Burn Terminal</p>
        </div>
      </footer>
    </div>
  )
}
