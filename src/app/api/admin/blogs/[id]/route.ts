import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidateBlogPages } from "@/lib/revalidate-public-content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const existing = await prisma.blog.findUnique({
    where: { id: parseInt(id) },
    select: { slug: true, category: { select: { slug: true } } },
  });
  const body = await req.json();
  const blog = await prisma.blog.update({
    where: { id: parseInt(id) },
    data: body,
    include: { category: { select: { slug: true } } },
  });
  revalidateBlogPages({
    categorySlug: existing?.category.slug,
    slug: existing?.slug,
  });
  revalidateBlogPages({
    categorySlug: blog.category.slug,
    slug: blog.slug,
  });
  return NextResponse.json(blog);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: parseInt(id) },
    select: { slug: true, category: { select: { slug: true } } },
  });
  await prisma.blog.delete({ where: { id: parseInt(id) } });
  revalidateBlogPages({
    categorySlug: blog?.category.slug,
    slug: blog?.slug,
  });
  return NextResponse.json({ success: true });
}
