import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidateBlogPages } from "@/lib/revalidate-public-content";
import {
  filenameFromPath,
  normalizeLocalUpload,
  promoteTmpUpload,
} from "@/lib/upload-paths";

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.blog.count({ where }),
  ]);

  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const parseId = (value: unknown) => {
    if (typeof value === "number" && Number.isInteger(value) && value > 0)
      return value;
    if (typeof value === "string" && /^\d+$/.test(value.trim())) {
      const id = Number(value);
      if (Number.isSafeInteger(id) && id > 0) return id;
    }
    return null;
  };
  const parseOptionalText = (value: unknown, field: string) => {
    if (value === undefined || value === null) return { value: null, error: null };
    if (typeof value === "string") return { value, error: null };
    return { value: null, error: `${field} must be a string.` };
  };

  if (typeof data.title !== "string" || !data.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (typeof data.slug !== "string" || !data.slug.trim()) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const categoryId = parseId(data.categoryId);
  if (!categoryId) {
    return NextResponse.json(
      { error: "Select a valid blog category." },
      { status: 400 },
    );
  }

  const sessionAuthorId = parseId(session.user?.id);
  const authorId =
    data.authorId === undefined ||
    data.authorId === null ||
    data.authorId === ""
      ? sessionAuthorId
      : parseId(data.authorId);
  if (!authorId) {
    return NextResponse.json(
      { error: "Select a valid author." },
      { status: 400 },
    );
  }

  const title = data.title.trim();
  const slug = data.slug.trim();
  const shortnote = parseOptionalText(data.shortnote ?? data.excerpt, "Excerpt");
  const description = parseOptionalText(
    data.description ?? data.content,
    "Content",
  );
  const thumbnailInput = parseOptionalText(
    data.thumbnailPath ?? data.thumbnail,
    "Thumbnail",
  );
  const imageInput = parseOptionalText(data.imagePath, "Image");
  const metaTitle = parseOptionalText(data.metaTitle, "Meta title");
  const metaKeyword = parseOptionalText(data.metaKeyword, "Meta keywords");
  const metaDescription = parseOptionalText(
    data.metaDescription,
    "Meta description",
  );
  const schema = parseOptionalText(data.schema, "Schema");
  const textFields = [
    shortnote,
    description,
    thumbnailInput,
    imageInput,
    metaTitle,
    metaKeyword,
    metaDescription,
    schema,
  ];
  const invalidText = textFields.find((field) => field.error);
  if (invalidText?.error) {
    return NextResponse.json({ error: invalidText.error }, { status: 400 });
  }

  const readingTime =
    data.readingTime === undefined ||
    data.readingTime === null ||
    data.readingTime === ""
      ? 5
      : parseId(data.readingTime);
  if (!readingTime) {
    return NextResponse.json(
      { error: "Reading time must be a positive whole number." },
      { status: 400 },
    );
  }

  for (const field of ["status", "homeView", "isFeatured", "trending"]) {
    if (data[field] !== undefined && typeof data[field] !== "boolean") {
      return NextResponse.json(
        { error: `${field} must be true or false.` },
        { status: 400 },
      );
    }
  }

  try {
    const [category, author] = await Promise.all([
      prisma.blogCategory.findUnique({
        where: { id: categoryId },
        select: { id: true, slug: true },
      }),
      prisma.user.findUnique({
        where: { id: authorId },
        select: { id: true },
      }),
    ]);

    if (!category) {
      return NextResponse.json(
        {
          error:
            "The selected blog category no longer exists. Refresh and select a category.",
        },
        { status: 400 },
      );
    }
    if (!author) {
      return NextResponse.json(
        {
          error:
            "The selected author no longer exists. Refresh and select an author.",
        },
        { status: 400 },
      );
    }

    const thumbnailPath =
      normalizeLocalUpload(thumbnailInput.value) ?? thumbnailInput.value;
    const imagePath =
      normalizeLocalUpload(imageInput.value) ?? imageInput.value;
    const readBoolean = (field: string, fallback: boolean) => {
      const value = data[field];
      return typeof value === "boolean" ? value : fallback;
    };

    let blog = await prisma.blog.create({
      data: {
        title,
        slug,
        shortnote: shortnote.value,
        description: description.value,
        thumbnailPath,
        thumbnailName: filenameFromPath(thumbnailPath),
        imagePath,
        imageName: filenameFromPath(imagePath),
        categoryId,
        authorId,
        readingTime,
        status: readBoolean("status", true),
        homeView: readBoolean("homeView", readBoolean("isFeatured", false)),
        trending: readBoolean("trending", false),
        metaTitle: metaTitle.value,
        metaKeyword: metaKeyword.value,
        metaDescription: metaDescription.value,
        schema: schema.value,
      },
    });
    revalidateBlogPages({ categorySlug: category.slug, slug: blog.slug });

    const promotedThumbnail = await promoteTmpUpload(
      blog.thumbnailPath,
      blog.id,
    );
    const promotedImage = await promoteTmpUpload(blog.imagePath, blog.id);
    const updates: Record<string, string | null> = {};
    if (promotedThumbnail !== blog.thumbnailPath)
      updates.thumbnailPath = promotedThumbnail;
    if (promotedImage !== blog.imagePath) updates.imagePath = promotedImage;
    if (Object.keys(updates).length > 0) {
      blog = await prisma.blog.update({ where: { id: blog.id }, data: updates });
    }

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_BLOG_POST] Failed to create blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post. Check the server logs for details." },
      { status: 500 },
    );
  }
}
