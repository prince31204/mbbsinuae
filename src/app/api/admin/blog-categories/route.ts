import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidateBlogPages } from "@/lib/revalidate-public-content";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : undefined;
  const [data, total] = await Promise.all([
    prisma.blogCategory.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.blogCategory.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const category = await prisma.blogCategory.create({ data: body });
  revalidateBlogPages({ categorySlug: category.slug });
  return NextResponse.json(category, { status: 201 });
}
