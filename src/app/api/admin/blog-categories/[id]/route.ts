import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidateBlogPages } from "@/lib/revalidate-public-content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const item = await prisma.blogCategory.findUnique({
    where: { id: parseInt(id) },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const existing = await prisma.blogCategory.findUnique({
    where: { id: parseInt(id) },
    select: { slug: true },
  });
  const body = await req.json();
  const category = await prisma.blogCategory.update({
    where: { id: parseInt(id) },
    data: body,
  });
  revalidateBlogPages({ categorySlug: existing?.slug });
  if (category.slug !== existing?.slug) {
    revalidateBlogPages({ categorySlug: category.slug });
  }
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: { id: parseInt(id) },
    select: { slug: true },
  });
  await prisma.blogCategory.delete({ where: { id: parseInt(id) } });
  revalidateBlogPages({ categorySlug: category?.slug });
  return NextResponse.json({ success: true });
}
