import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata, APP_YEAR, breadcrumbSchema } from "@/lib/seo";
import { formatCurrencyRange, withCurrencySymbol } from "@/lib/currency";

export const metadata: Promise<Metadata> = buildMetadata({
  title: `MBBS Scholarships in UAE ${APP_YEAR} — Government & Merit Based`,
  description:
    "Find all scholarships for MBBS in UAE. Government, merit, and embassy scholarships for Indian students. Apply before deadlines.",
  entitySeo: {
    metaKeyword: `MBBS scholarship UAE, scholarship for MBBS UAE ${APP_YEAR}, merit scholarship UAE`,
  },
  path: "/scholarships",
  pageKey: "scholarships",
});

export const revalidate = 3600;

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return "Contact for details";
  return formatCurrencyRange(min || 0, max);
}

function getTypeColor(type: string | null): string {
  switch ((type || "").toLowerCase()) {
    case "merit":
      return "bg-[#E6EEE8] text-[#123B2A] font-medium";
    case "need":
      return "bg-green-100 text-green-800";
    case "government":
      return "bg-purple-100 text-purple-800";
    case "private":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getModeColor(mode: string | null): string {
  switch ((mode || "").toLowerCase()) {
    case "direct":
      return "bg-emerald-100 text-emerald-800";
    case "through_university":
      return "bg-[#E6EEE8] text-[#123B2A] font-medium";
    case "through_ministry":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatMode(mode: string | null): string {
  if (!mode) return "";
  return mode.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function ScholarshipsPage() {
  const [scholarships, statsSetting] = await Promise.all([
    prisma.scholarship
      .findMany({
        where: { isActive: true },
        include: {
          university: {
            select: {
              name: true,
              slug: true,
              city: true,
              cityRelation: { select: { name: true } },
            },
          },
        },
        orderBy: [{ deadline: "asc" }, { id: "asc" }],
      })
      .catch(() => []),
    prisma.websiteSetting
      .findUnique({
        where: { key: "stats_annual_aid" },
        select: { value: true },
      })
      .catch(() => null),
  ]);

  const totalAidCalculated = scholarships.reduce((sum, s) => {
    const amount = s.amountMax
      ? Number(s.amountMax)
      : s.amountMin
        ? Number(s.amountMin)
        : 0;
    const seats = s.availableSeats || 1;
    return sum + amount * seats;
  }, 0);

  const totalAidDisplay =
    totalAidCalculated > 0
      ? withCurrencySymbol(`${Math.round(totalAidCalculated / 1000)}k+`)
      : withCurrencySymbol("2000k+");

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Scholarships", url: "/scholarships" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#E6EEE8] rounded-full p-4">
              <GraduationCap className="w-12 h-12 text-[#00843D]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-[#202124]">
            MBBS Scholarships in UAE
          </h1>
          <p className="text-xl text-[#343A40] max-w-3xl mx-auto mb-10">
            Discover government, merit, and university scholarships to fund your
            MBBS education in UAE.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              {
                val: `${scholarships.length || "250"}+`,
                label: "Scholarships Available",
              },
              { val: totalAidDisplay, label: "Total Aid Distributed" },
              { val: "85%", label: "Students Receive Aid" },
              { val: "95%", label: "Success Rate" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-[#F4F7F5] rounded-xl p-4 border border-[#D9E3DC]"
              >
                <div className="text-3xl font-bold text-[#00843D]">{s.val}</div>
                <div className="text-[#343A40] text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter bar hint */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {scholarships.length > 0
              ? `${scholarships.length} Scholarships Available`
              : "All Scholarships"}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Sorted by deadline (earliest first)</span>
          </div>
        </div>

        {scholarships.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl">
              No scholarships available at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {scholarships.map((s) => {
              const eligibility = (s.eligibility as unknown as string[]) || [];
              const coverage = (s.coverage as unknown as string[]) || [];
              const cityName =
                s.university?.cityRelation?.name || s.university?.city || null;

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#D9E3DC] hover:border-[#00843D] overflow-hidden flex flex-col group"
                >
                  {/* Card Header */}
                  <div className="bg-[#F4F7F5] border-b border-[#D9E3DC] p-6 text-[#202124]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {s.university && (
                          <Link
                            href={`/universities/${s.university.slug}`}
                            className="text-xl font-bold text-[#202124] hover:text-[#00843D] transition-colors"
                          >
                            {s.university.name}
                          </Link>
                        )}
                        {!s.university && (
                          <h3 className="text-xl font-bold text-[#202124]">{s.title}</h3>
                        )}
                        {cityName && (
                          <div className="flex items-center text-[#343A40] mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[#00843D]" />
                            <span className="text-sm">{cityName}, UAE</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {s.scholarshipType && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border border-[#D9E3DC] text-[#123B2A] bg-white`}
                          >
                            {s.scholarshipType}
                          </span>
                        )}
                      </div>
                    </div>
                    {s.university && (
                      <div className="border-t border-[#D9E3DC] pt-3 mt-1">
                        <h4 className="text-base font-semibold text-[#202124]">{s.title}</h4>
                        {s.program && (
                          <p className="text-[#343A40] text-sm">{s.program}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* 4-stat grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-[#00843D] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold text-[#202124] text-sm">
                            {formatAmount(
                              s.amountMin ? Number(s.amountMin) : null,
                              s.amountMax ? Number(s.amountMax) : null,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-[#C8102E] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-semibold text-[#202124] text-sm">
                            {s.deadline
                              ? new Date(s.deadline).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "Open"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-[#00843D] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Available Seats
                          </p>
                          <p className="font-semibold text-[#202124] text-sm">
                            {s.availableSeats
                              ? `${s.availableSeats} seats`
                              : "Open"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-5 h-5 text-[#123B2A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Program</p>
                          <p className="font-semibold text-[#202124] text-sm">
                            {s.program || "MBBS"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Application Mode badge */}
                    {s.applicationMode && (
                      <div className="mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(s.applicationMode)}`}
                        >
                          {formatMode(s.applicationMode)}
                        </span>
                      </div>
                    )}

                    {/* Eligibility */}
                    {eligibility.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-[#202124] mb-2">
                          Key Eligibility:
                        </h5>
                        <ul className="text-sm text-[#343A40] space-y-1">
                          {eligibility.slice(0, 3).map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-[#00843D] rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {eligibility.length > 3 && (
                            <li className="text-[#00843D] font-medium text-xs">
                              +{eligibility.length - 3} more criteria
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Coverage */}
                    {coverage.length > 0 && (
                      <div className="mb-5">
                        <h5 className="text-sm font-semibold text-[#202124] mb-2">
                          Coverage:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {coverage.map((item, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 bg-[#E6EEE8] text-[#123B2A] text-xs rounded-md border border-[#D9E3DC]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto">
                      <Link
                        href={`/scholarships/${s.slug}`}
                        className="w-full bg-[#00843D] hover:bg-[#006830] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg shadow-sm"
                      >
                        <span>View Full Details</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Need Help CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#123B2A] to-[#0A2318] rounded-2xl shadow-xl p-10 text-center border border-[#1D5C42] text-white">
          <h3 className="text-2xl font-bold text-white mb-3">
            Need Help with Scholarship Applications?
          </h3>
          <p className="text-[#E6EEE8] mb-8 max-w-2xl mx-auto">
            Our scholarship counselors are here to guide you through the
            application process and help you secure the best financial aid
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us?source=talk_to_counselor"
              className="bg-[#00843D] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#006830] transition-colors shadow-md"
            >
              Talk to a Counselor
            </Link>
            <Link
              href="/universities"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#123B2A] transition-colors"
            >
              Browse Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
