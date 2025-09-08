const WALLET_ADDRESS = "9vNBQwVD9Lvgdua4bBvXMSySBbggDAG3VbwdvsR1tFuX"

export async function GET() {
  try {
    const response = await fetch(
      `https://frontend-api-v3.pump.fun/coins/user-created-coins/${WALLET_ADDRESS}?offset=0&limit=10&includeNsfw=false`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch tokens from pump.fun")
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching pump tokens:", error)
    return Response.json({ error: "Failed to fetch pump tokens" }, { status: 500 })
  }
}
