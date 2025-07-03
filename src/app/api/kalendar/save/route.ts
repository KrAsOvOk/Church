import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Tento endpoint prijíma údaje udalosti a uloží ich ako JSON do Blob Storage
export async function POST(req: NextRequest) {
  // 1. Získame údaje udalosti z tela požiadavky
  const data = await req.json();

  // 2. Skontrolujeme, či sú vyplnené povinné polia
  if (!data || !data.title || !data.date) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // 3. Vytvoríme unikátne meno súboru (napr. podľa času)
  const filename = `calendar-event-${Date.now()}.json`;

  // 4. Uložíme údaje ako JSON do Blob Storage
  const blob = await put(filename, JSON.stringify(data), {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  // 5. Vrátime URL, kde je udalosť uložená
  return NextResponse.json({ url: blob.url });
}