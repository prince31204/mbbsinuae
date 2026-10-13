import Link from "next/link";
import {
  Award,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HomePageStats } from "@/lib/public-page-content";
import { formatCurrencyRange } from "@/lib/currency";

interface ScholarshipsSectionProps {
  stats: HomePageStats;
}

type EligibilityItem = string;
type CoverageItem = string;

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return "Contact for details";
  return formatCurrencyRange(min || 0, max);
}

function formatDeadline(deadline: Date | null): string {
  if (!deadline) return "Open";
  return new Date(deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTypeColor(type: string | null): string {
  switch ((type || "").toLowerCase()) {
    case "government":
      return "bg-[#E6EEE8] text-[#00843D] font-semibold";
    case "embassy":
      return "bg-[#E6EEE8] text-[#123B2A] font-semibold";
    case "university":
      return "bg-slate-100 text-[#202124] font-semibold";
    case "merit":
      return "bg-[#E6EEE8] text-[#00843D] font-semibold";
    default:
      return "bg-gray-100 text-[#343A40] font-medium";
  }
}

export default async function ScholarshipsSection({
  stats,
}: ScholarshipsSectionProps) {
  const scholarships = await prisma.scholarship
    .findMany({
      where: { isActive: true, universityId: null },
      select: {
        id: true,
        slug: true,
        title: true,
        scholarshipType: true,
        program: true,
        amountMin: true,
        amountMax: true,
        deadline: true,
        availableSeats: true,
        eligibility: true,
        coverage: true,
      },
      take: 4,
      orderBy: { id: "asc" },
    })
    .catch(() => []);

  return (
    <section id="scholarships" className="py-16 bg-white border-b border-[#D9E3DC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
            Financial Aid & Grants
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] mb-3">
            Scholarships &amp; Financial Aid
          </h2>
          <p className="text-base text-[#343A40] max-w-3xl mx-auto leading-relaxed">
            Make your education dreams affordable with various merit and institutional scholarship
            opportunities available for international students studying in UAE.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Award className="w-10 h-10 text-[#00843D] mx-auto mb-3" />,
              val: stats.scholarships,
              label: "Government & University Scholarships",
            },
            {
              icon: (
                <DollarSign className="w-10 h-10 text-[#00843D] mx-auto mb-3" />
              ),
              val: stats.annualAid,
              label: "Est. Total Annual Aid",
            },
            {
              icon: <Users className="w-10 h-10 text-[#00843D] mx-auto mb-3" />,
              val: stats.meritAwards,
              label: "Merit-Based Awards",
            },
            {
              icon: <Star className="w-10 h-10 text-[#00843D] mx-auto mb-3" />,
              val: stats.verifiedPrograms,
              label: "Verified Programs",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl bg-[#F4F7F5] border border-[#D9E3DC] p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-md"
            >
              {s.icon}
              <div className="mb-1 text-3xl font-extrabold text-[#202124]">
                {s.val}
              </div>
              <div className="font-medium text-[#343A40] text-xs sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {scholarships.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {scholarships.map((scholarship) => {
              const eligibilityItems =
                (scholarship.eligibility as unknown as EligibilityItem[]) || [];
              const coverageItems =
                (scholarship.coverage as unknown as CoverageItem[]) || [];

              return (
                <div
                  key={scholarship.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#D9E3DC] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-xl"
                >
                  {/* Header banner */}
                  <div className="relative flex h-32 flex-col justify-end bg-[#123B2A] border-b border-[#1D5C42] p-6">
                    <div className="absolute top-4 left-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${getTypeColor(scholarship.scholarshipType)}`}
                      >
                        {scholarship.scholarshipType || "Merit"}
                      </span>
                    </div>
                    <h3 className="relative text-xl font-bold text-white">
                      {scholarship.title}
                    </h3>
                    {scholarship.program && (
                      <p className="relative text-xs text-[#E6EEE8]">
                        {scholarship.program}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="rounded-xl bg-[#E6EEE8]/50 border border-[#D9E3DC] p-4">
                        <DollarSign className="mb-1 h-5 w-5 text-[#00843D]" />
                        <div className="text-xs text-[#343A40]">Amount</div>
                        <div className="font-bold text-[#00843D] text-sm sm:text-base">
                          {formatAmount(
                            scholarship.amountMin
                              ? Number(scholarship.amountMin)
                              : null,
                            scholarship.amountMax
                              ? Number(scholarship.amountMax)
                              : null,
                          )}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#F4F7F5] border border-[#D9E3DC] p-4">
                        <Calendar className="mb-1 h-5 w-5 text-[#00843D]" />
                        <div className="text-xs text-[#343A40]">Deadline</div>
                        <div className="font-bold text-[#202124] text-sm sm:text-base">
                          {formatDeadline(scholarship.deadline)}
                        </div>
                      </div>
                    </div>

                    {eligibilityItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-[#202124] text-sm mb-2">
                          Eligibility
                        </h4>
                        <div className="space-y-1">
                          {eligibilityItems.slice(0, 3).map((item, i) => (
                            <p key={i} className="text-[#343A40] text-xs leading-relaxed">
                              • {item}
                            </p>
                          ))}
                        </div>
                        {scholarship.availableSeats && (
                          <div className="flex items-center mt-2 text-xs text-[#343A40]">
                            <Users className="w-3.5 h-3.5 mr-1 text-[#00843D]" />
                            <span>
                              {scholarship.availableSeats} scholarships available
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {coverageItems.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-[#202124] text-sm mb-3">
                          Coverage Includes
                        </h4>
                        <div className="space-y-2">
                          {coverageItems.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                              <span className="text-[#343A40] text-xs">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        href={`/scholarships/${scholarship.slug}`}
                        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#00843D] hover:bg-[#006830] py-3 font-semibold text-white transition-all shadow-sm group-hover:shadow"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Need Help CTA */}
        <div className="text-center mt-12 bg-[#F4F7F5] border border-[#D9E3DC] rounded-3xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#202124] mb-3">
            Need Help with Scholarship Applications?
          </h3>
          <p className="text-[#343A40] text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
            Our specialized scholarship counselors are here to guide you through the
            application process, documentation, and help you secure financial aid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scholarships"
              className="bg-[#00843D] hover:bg-[#006830] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              Explore Scholarships
            </Link>
            <Link
              href="/contact-us?source=talk_to_counselor"
              className="border-2 border-[#00843D] text-[#00843D] hover:bg-[#E6EEE8] px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
            >
              Talk to a Counselor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
