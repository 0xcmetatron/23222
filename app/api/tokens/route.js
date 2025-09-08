import { getUserTokens } from "@/lib/db.js"

export async function GET() {
  try {
    const tokens = await getUserTokens()
    return Response.json({ tokens })
  } catch (error) {
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 })
  }
}
