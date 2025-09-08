import mysql from "mysql2/promise"
import { config } from "./config.js"

let connection = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      ssl: false,
    })
  }
  return connection
}

export async function getBalance() {
  try {
    const walletAddress = "829KbRjUYwwdX93x83TL7RiQszmQ4g7vknHiLhBxZcmK"
    const response = await fetch(`https://api.mainnet-beta.solana.com`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [walletAddress],
      }),
    })

    const data = await response.json()
    if (data.result && data.result.value !== undefined) {
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      return data.result.value / 1000000000
    }

    // Fallback to database balance if API fails
    const conn = await getConnection()
    const [rows] = await conn.execute("SELECT SUM(sol_amount) as balance FROM token_purchases")
    return rows[0]?.balance || 0
  } catch (error) {
    console.error("Balance fetch error:", error)
    // Fallback to database balance
    try {
      const conn = await getConnection()
      const [rows] = await conn.execute("SELECT SUM(sol_amount) as balance FROM token_purchases")
      return rows[0]?.balance || 0
    } catch (dbError) {
      console.error("Database error:", dbError)
      return 0
    }
  }
}

export async function getTransactions() {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(
      "SELECT id, action, mint, sol_amount, tx_sig, balance, created_at FROM buyback_log ORDER BY created_at DESC LIMIT 10",
    )
    return rows
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function getUserTokens() {
  try {
    const walletAddress = "829KbRjUYwwdX93x83TL7RiQszmQ4g7vknHiLhBxZcmK"
    const response = await fetch(
      `https://frontend-api-v3.pump.fun/coins/user-created-coins/${walletAddress}?offset=0&limit=10&includeNsfw=false`,
    )
    const data = await response.json()
    return data.coins || []
  } catch (error) {
    console.error("API error:", error)
    return []
  }
}

export async function getConfig() {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute("SELECT cycle_seconds, last_run FROM config LIMIT 1")
    return rows[0] || { cycle_seconds: 3600, last_run: new Date() }
  } catch (error) {
    console.error("Database error:", error)
    return { cycle_seconds: 3600, last_run: new Date() }
  }
}
