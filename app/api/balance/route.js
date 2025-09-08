import { getBalance } from "@/lib/db.js"

export async function GET() {
  try {
    const balance = await getBalance()
    return Response.json({ balance })
  } catch (error) {
    return Response.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
