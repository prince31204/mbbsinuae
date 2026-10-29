import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateNewsPages } from "@/lib/revalidate-public-content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const newsId = Number(id);
  if (!Number.isSafeInteger(newsId) || newsId <= 0)
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const item = await prisma.news.findUnique({
    where: { id: newsId },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const newsId = Number(id);
  if (!Number.isSafeInteger(newsId) || newsId <= 0)
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const existing = await prisma.news.findUnique({
    where: { id: newsId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body))
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  for (const field of ["title", "slug"]) {
    if (
      body[field] !== undefined &&
      (typeof body[field] !== "string" || !body[field].trim())
    )
      return NextResponse.json(
        { error: `${field} must be a non-empty string.` },
        { status: 400 },
      );
  }
  for (const field of [
    "shortnote",
    "description",
    "thumbnailPath",
    "imagePath",
    "metaTitle",
    "metaKeyword",
    "metaDescription",
  ]) {
    if (
      body[field] !== undefined &&
      body[field] !== null &&
      typeof body[field] !== "string"
    )
      return NextResponse.json(
        { error: `${field} must be a string.` },
        { status: 400 },
      );
  }
  for (const field of ["status", "homeView", "trending"]) {
    if (body[field] !== undefined && typeof body[field] !== "boolean")
      return NextResponse.json({ error: `${field} must be true or false.` }, { status: 400 });
  }
  if (body.categoryId !== undefined && body.categoryId !== "") {
    const categoryId = Number(body.categoryId);
    if (!Number.isSafeInteger(categoryId) || categoryId <= 0)
      return NextResponse.json({ error: "Select a valid news category." }, { status: 400 });
    const category = await prisma.newsCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category)
      return NextResponse.json({ error: "The selected news category does not exist." }, { status: 400 });
  }
  const item = await prisma.news.update({
    where: { id: newsId },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.shortnote !== undefined
        ? { shortnote: body.shortnote || null }
        : {}),
      ...(body.description !== undefined
        ? { description: body.description || null }
        : {}),
      ...(body.thumbnailPath !== undefined
        ? { thumbnailPath: body.thumbnailPath || null }
        : {}),
      ...(body.imagePath !== undefined
        ? { imagePath: body.imagePath || null }
        : {}),
      ...(body.categoryId
        ? { categoryId: Number(body.categoryId) }
        : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.homeView !== undefined ? { homeView: body.homeView } : {}),
      ...(body.trending !== undefined ? { trending: body.trending } : {}),
      ...(body.metaTitle !== undefined
        ? { metaTitle: body.metaTitle || null }
        : {}),
      ...(body.metaKeyword !== undefined
        ? { metaKeyword: body.metaKeyword || null }
        : {}),
      ...(body.metaDescription !== undefined
        ? { metaDescription: body.metaDescription || null }
        : {}),
    },
  });
  revalidateNewsPages();
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const newsId = Number(id);
  if (!Number.isSafeInteger(newsId) || newsId <= 0)
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const existing = await prisma.news.findUnique({
    where: { id: newsId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.news.delete({ where: { id: newsId } });
  revalidateNewsPages();
  return NextResponse.json({ success: true });
}
