import { getConfig } from "@/lib/db.js"

export async function GET() {
  try {
    const config = await getConfig()
    return Response.json(config)
  } catch (error) {
    return Response.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}
