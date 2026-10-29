import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateNewsPages } from "@/lib/revalidate-public-content";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { fid } = await params;
  try {
    const { question, answer } = await req.json();
    const faq = await prisma.newsFaq.update({
      where: { id: parseInt(fid) },
      data: { question: question?.trim(), answer },
    });
    revalidateNewsPages();
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
  await prisma.newsFaq.delete({ where: { id: parseInt(fid) } });
  revalidateNewsPages();
  return NextResponse.json({ ok: true });
}
