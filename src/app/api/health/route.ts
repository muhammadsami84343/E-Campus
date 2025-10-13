// app/api/health/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic"; // always run on server
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    // Ping the database by listing collections
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ ok: true, collections: collections.map(c => c.name) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
