import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateArticlePages } from "@/lib/revalidate-public-content";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const articleId = parseInt(id);
  const faqs = await prisma.articleFaq.findMany({
    where: { articleId },
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
  const articleId = parseInt(id);
  try {
    const { question, answer } = await req.json();
    if (!question?.trim())
      return NextResponse.json({ error: "Question required" }, { status: 422 });
    const faq = await prisma.articleFaq.create({
      data: { articleId, question: question.trim(), answer: answer ?? "" },
    });
    revalidateArticlePages();
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
