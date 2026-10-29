import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateArticlePages } from "@/lib/revalidate-public-content";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; cid: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { cid } = await params;
  try {
    const body = await req.json();
    const item = await prisma.articleContent.update({
      where: { id: parseInt(cid) },
      data: {
        title: body.title?.trim(),
        description: body.description ?? undefined,
        imagePath: body.imagePath ?? undefined,
        imageName: body.imageName ?? undefined,
        position:
          body.position !== undefined ? parseInt(body.position) : undefined,
        parentId:
          body.parentId !== undefined
            ? body.parentId
              ? parseInt(body.parentId)
              : null
            : undefined,
      },
    });
    revalidateArticlePages();
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cid: string }> },
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  const { cid } = await params;
  await prisma.articleContent.delete({ where: { id: parseInt(cid) } });
  revalidateArticlePages();
  return NextResponse.json({ ok: true });
}
