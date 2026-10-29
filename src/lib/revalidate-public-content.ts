import { revalidatePath } from "next/cache";

type BlogPaths = {
  categorySlug?: string | null;
  slug?: string | null;
  all?: boolean;
};

function revalidateCategorizedPages(basePath: string) {
  revalidatePath(basePath);
  revalidatePath(`${basePath}/[categorySlug]`, "page");
  revalidatePath(`${basePath}/[categorySlug]/[slug]`, "page");
}

export function revalidateScholarshipPages(slug?: string | null) {
  revalidatePath("/scholarships");
  if (slug) {
    revalidatePath(`/scholarships/${slug}`);
  } else {
    revalidatePath("/scholarships/[slug]", "page");
  }
}

export function revalidateArticlePages() {
  revalidateCategorizedPages("/articles");
}

export function revalidateNewsPages() {
  revalidateCategorizedPages("/news");
}

export function revalidateBlogPages({
  categorySlug,
  slug,
  all = false,
}: BlogPaths = {}) {
  revalidatePath("/blog");

  if (all) {
    revalidatePath("/blog/[categorySlug]", "page");
    revalidatePath("/blog/[categorySlug]/[blogSlug]", "page");
    return;
  }

  if (categorySlug) {
    revalidatePath(`/blog/${categorySlug}`);
  } else {
    revalidatePath("/blog/[categorySlug]", "page");
  }

  if (categorySlug && slug) {
    revalidatePath(`/blog/${categorySlug}/${slug}`);
  } else {
    revalidatePath("/blog/[categorySlug]/[blogSlug]", "page");
  }
}
