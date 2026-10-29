import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidateNewsPages } from "@/lib/revalidate-public-content";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const items = await prisma.newsCategory.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  if (!body.name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  const item = await prisma.newsCategory.create({
    data: {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: body.status ?? true,
    },
  });
  revalidateNewsPages();
  return NextResponse.json(item, { status: 201 });
}
