import { prisma } from "@/lib/prisma";
import FmgeRatesTable from "./FmgeRatesTable";
import Link from "next/link";

export default async function FmgeSection() {
  const rows = await prisma.universityFmgeRate
    .findMany({
      where: { status: true },
      select: {
        year: true,
        appeared: true,
        passed: true,
        passPercentage: true,
        university: { select: { name: true, slug: true } },
      },
      orderBy: { year: "desc" },
    })
    .catch(() => []);

  const data = rows.map((r) => ({
    universityName: r.university.name,
    slug: r.university.slug,
    year: r.year,
    appeared: r.appeared,
    passed: r.passed,
    passPercentage: r.passPercentage ? Number(r.passPercentage) : null,
  }));

  // Build year overview cards (like old React Newanup.tsx)
  const yearMap: Record<number, { total: number; accepted: number }> = {};
  for (const r of data) {
    if (!yearMap[r.year]) yearMap[r.year] = { total: 0, accepted: 0 };
    yearMap[r.year].total += r.appeared ?? 0;
    yearMap[r.year].accepted += r.passed ?? 0;
  }
  const yearOverviews = Object.entries(yearMap)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, vals]) => ({
      year,
      total: vals.total,
      accepted: vals.accepted,
      rate: vals.total > 0 ? (vals.accepted / vals.total) * 100 : 0,
    }));

  return (
    <section className="bg-[#F4F7F5] py-16 border-b border-[#D9E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FmgeRatesTable data={data} />

        {/* Year-wise Overview Cards */}
        {yearOverviews.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yearOverviews.map(({ year, total, accepted, rate }) => (
              <div
                key={year}
                className="group relative overflow-hidden rounded-2xl border border-[#D9E3DC] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-md"
              >
                <div className="relative">
                  <h3 className="mb-4 text-lg font-bold text-[#202124] transition-colors duration-300 group-hover:text-[#00843D]">
                    {year} Overview
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center rounded-xl border border-[#D9E3DC]/70 bg-[#F4F7F5] px-3.5 py-2">
                      <span className="text-xs text-[#343A40] font-medium">
                        Total Applications:
                      </span>
                      <span className="font-bold text-[#202124] text-sm">
                        {total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-xl border border-[#D9E3DC]/70 bg-[#F4F7F5] px-3.5 py-2">
                      <span className="text-xs text-[#343A40] font-medium">
                        Accepted Students:
                      </span>
                      <span className="font-bold text-[#202124] text-sm">
                        {accepted.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-xl border border-[#D9E3DC]/70 bg-[#E6EEE8]/50 px-3.5 py-2">
                      <span className="text-xs text-[#343A40] font-medium">
                        Passing / Acceptance Rate:
                      </span>
                      <span className="font-extrabold text-[#00843D] text-sm">
                        {rate.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/fmge-rates"
            className="inline-block bg-white text-[#00843D] border-2 border-[#00843D] hover:bg-[#00843D] hover:text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
          >
            View Full FMGE Data →
          </Link>
        </div>
      </div>
    </section>
  );
}
