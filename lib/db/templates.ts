import { prisma } from "../prisma";

export async function getModelById(id: string) {
  return await prisma.vaultTemplate.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      clauses: true,
      tags: true,
      status: true,
      rawText: true,
      fileUrl: true, // ✅ essentiel pour charger le PDF
      createdAt: true,
      updatedAt: true,
    },
  });
}
