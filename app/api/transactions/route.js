import { getTransactions } from "@/lib/db.js"

export async function GET() {
  try {
    const transactions = await getTransactions()
    return Response.json({ transactions })
  } catch (error) {
    return Response.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
