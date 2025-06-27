import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

// 🔄 GET : Récupérer tous les contrats
export async function GET() {
  const contrats = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(contrats)
}

// ➕ POST : Créer un contrat
export async function POST(req: NextRequest) {
  const body = await req.json()

  const { title, status, createdBy } = body

  if (!title || !status || !createdBy) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const nouveauContrat = await prisma.contract.create({
    data: { title, status, createdBy },
  })

  return NextResponse.json(nouveauContrat)
}
