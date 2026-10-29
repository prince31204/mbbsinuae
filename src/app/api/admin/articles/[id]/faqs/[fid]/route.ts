import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateArticlePages } from "@/lib/revalidate-public-content";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { fid } = await params;
  try {
    const { question, answer } = await req.json();
    const faq = await prisma.articleFaq.update({
      where: { id: parseInt(fid) },
      data: { question: question?.trim(), answer },
    });
    revalidateArticlePages();
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { fid } = await params;
  await prisma.articleFaq.delete({ where: { id: parseInt(fid) } });
  revalidateArticlePages();
  return NextResponse.json({ ok: true });
}
