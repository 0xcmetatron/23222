export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const mint = searchParams.get("mint")

    if (!mint) {
      return Response.json({ error: "Mint parameter is required" }, { status: 400 })
    }

    const response = await fetch(`https://frontend-api-v3.pump.fun/coins/top-holders/${mint}`)

    if (!response.ok) {
      throw new Error("Failed to fetch top holders from pump.fun")
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching top holders:", error)
    return Response.json({ error: "Failed to fetch top holders" }, { status: 500 })
  }
}
