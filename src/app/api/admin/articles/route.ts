import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { normalizeLocalUpload, promoteTmpUpload } from "@/lib/upload-paths";
import { revalidateArticlePages } from "@/lib/revalidate-public-content";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.article.count({ where }),
  ]);
  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      );
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.slug !== "string" ||
    !body.slug.trim()
  )
    return NextResponse.json(
      { error: "Title and slug required" },
      { status: 400 },
    );
  const categoryId = Number(body.categoryId);
  const authorId = Number(session.user?.id);
  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json(
      { error: "Select a valid article category." },
      { status: 400 },
    );
  }
  if (!Number.isSafeInteger(authorId) || authorId <= 0) {
    return NextResponse.json(
      { error: "Unable to determine the current author." },
      { status: 401 },
    );
  }
  const [category, author] = await Promise.all([
    prisma.articleCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    }),
    prisma.user.findUnique({ where: { id: authorId }, select: { id: true } }),
  ]);
  if (!category) {
    return NextResponse.json(
      { error: "The selected article category does not exist." },
      { status: 400 },
    );
  }
  if (!author) {
    return NextResponse.json(
      { error: "The current author account could not be found." },
      { status: 401 },
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
    ) {
      return NextResponse.json(
        { error: `${field} must be a string.` },
        { status: 400 },
      );
    }
  }
  for (const field of ["status", "homeView", "trending"]) {
    if (body[field] !== undefined && typeof body[field] !== "boolean") {
      return NextResponse.json(
        { error: `${field} must be true or false.` },
        { status: 400 },
      );
    }
  }

  const thumbnailPath =
    normalizeLocalUpload(body.thumbnailPath as string | null | undefined) ??
    (body.thumbnailPath as string | null | undefined) ??
    null;
  const imagePath =
    normalizeLocalUpload(body.imagePath as string | null | undefined) ??
    (body.imagePath as string | null | undefined) ??
    null;

  let item = await prisma.article.create({
    data: {
      title: body.title.trim(),
      slug: body.slug.trim(),
      shortnote:
        (body.shortnote as string | null | undefined) || null,
      description:
        (body.description as string | null | undefined) || null,
      thumbnailPath,
      imagePath,
      categoryId,
      authorId,
      status: (body.status as boolean | undefined) ?? true,
      homeView: (body.homeView as boolean | undefined) ?? false,
      trending: (body.trending as boolean | undefined) ?? false,
      metaTitle: (body.metaTitle as string | null | undefined) || null,
      metaKeyword: (body.metaKeyword as string | null | undefined) || null,
      metaDescription:
        (body.metaDescription as string | null | undefined) || null,
    },
  });

  const promotedThumbnail = await promoteTmpUpload(item.thumbnailPath, item.id);
  const promotedImage = await promoteTmpUpload(item.imagePath, item.id);
  const updates: Record<string, string | null> = {};
  if (promotedThumbnail !== item.thumbnailPath)
    updates.thumbnailPath = promotedThumbnail;
  if (promotedImage !== item.imagePath) updates.imagePath = promotedImage;
  if (Object.keys(updates).length > 0) {
    item = await prisma.article.update({
      where: { id: item.id },
      data: updates,
    });
  }
  revalidateArticlePages();
  return NextResponse.json(item, { status: 201 });
}
