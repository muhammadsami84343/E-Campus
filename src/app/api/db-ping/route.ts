import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const ok = await db.command({ ping: 1 });
    return NextResponse.json({ ok, db: db.databaseName });
  } catch (e: any) {
    console.error("DB PING ERROR:", e);
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}