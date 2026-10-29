import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateNewsPages } from "@/lib/revalidate-public-content";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const newsId = parseInt(id);
  const faqs = await prisma.newsFaq.findMany({
    where: { newsId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(faqs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const newsId = parseInt(id);
  try {
    const { question, answer } = await req.json();
    if (!question?.trim())
      return NextResponse.json({ error: "Question required" }, { status: 422 });
    const faq = await prisma.newsFaq.create({
      data: { newsId, question: question.trim(), answer: answer ?? "" },
    });
    revalidateNewsPages();
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
