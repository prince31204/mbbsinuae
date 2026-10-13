import Link from "next/link";
import {
  GraduationCap,
  Banknote,
  Clock,
  Calendar,
  Users,
  BookOpen,
  CheckCircle,
  Globe,
  ExternalLink,
} from "lucide-react";

interface Program {
  id: number;
  programName: string;
  programSlug: string;
  studyMode: string | null;
  annualTuitionFee: any;
  totalFee: any;
  currency: string | null;
  duration: string | null;
  intake: string | null;
  applicationDeadline: string | null;
  seats: string | null;
  eligibility: string | null;
  overview: string | null;
  accreditation: string | null;
  medium: string | null;
}

interface Props {
  universitySlug: string;
  programs: Program[];
}

export default function UniversityPrograms({
  universitySlug,
  programs,
}: Props) {
  if (programs.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#E6EEE8] text-[#00843D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-[#00843D]/20">
            Admissions Open
          </span>
          <h2 className="text-3xl font-bold text-[#202124]">
            Available Courses
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {programs.map((program) => (
            <Link
              href={`/universities/${universitySlug}/courses/${program.programSlug}`}
              key={program.id}
              className="block group/card bg-white border border-[#D9E3DC] border-l-4 border-l-[#00843D] rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-[#123B2A] px-5 py-5 md:w-44 flex flex-col justify-center shrink-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="text-white text-[10px] font-semibold uppercase tracking-widest">
                      Program
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight mb-2">
                    {program.programName}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {program.studyMode && (
                      <span className="bg-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        {program.studyMode}
                      </span>
                    )}
                    <span className="bg-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      English
                    </span>
                  </div>
                </div>
                <div className="flex-1 px-6 py-5">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {program.annualTuitionFee && (
                      <div className="flex items-center gap-2 bg-[#E6EEE8] border border-[#D9E3DC] rounded-xl px-4 py-2.5">
                        <Banknote className="w-4 h-4 text-[#00843D] shrink-0" />
                        <div>
                          <p className="text-xs text-[#343A40] leading-none mb-0.5">
                            Annual Fee
                          </p>
                          <p className="font-bold text-[#202124] text-sm">
                            {program.currency || "USD"}{" "}
                            {Number(program.annualTuitionFee).toLocaleString()}
                          </p>
                          {program.totalFee != null && (
                            <p className="text-[10px] text-[#343A40] leading-none mt-0.5">
                              Total: {program.currency || "USD"}{" "}
                              {Number(program.totalFee).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {program.duration && (
                      <div className="flex items-center gap-2 bg-white border border-[#D9E3DC] rounded-xl px-4 py-2.5">
                        <Clock className="w-4 h-4 text-[#C8102E] shrink-0" />
                        <div>
                          <p className="text-xs text-[#343A40] leading-none mb-0.5">
                            Duration
                          </p>
                          <p className="font-bold text-[#202124] text-sm">
                            {program.duration}
                          </p>
                        </div>
                      </div>
                    )}
                    {program.intake && (
                      <div className="flex items-center gap-2 bg-[#F4F7F5] border border-[#D9E3DC] rounded-xl px-4 py-2.5">
                        <Calendar className="w-4 h-4 text-[#00843D] shrink-0" />
                        <div>
                          <p className="text-xs text-[#343A40] leading-none mb-0.5">
                            Intake
                          </p>
                          <p className="font-bold text-[#202124] text-sm">
                            {program.intake}
                          </p>
                        </div>
                      </div>
                    )}
                    {program.applicationDeadline && (
                      <div className="flex items-center gap-2 bg-[#F4F7F5] border border-[#D9E3DC] rounded-xl px-4 py-2.5">
                        <Users className="w-4 h-4 text-[#00843D] shrink-0" />
                        <div>
                          <p className="text-xs text-[#343A40] leading-none mb-0.5">
                            Deadline
                          </p>
                          <p className="font-bold text-[#202124] text-sm">
                            {program.applicationDeadline}
                          </p>
                        </div>
                      </div>
                    )}
                    {program.seats && (
                      <div className="flex items-center gap-2 bg-white border border-[#D9E3DC] rounded-xl px-4 py-2.5">
                        <BookOpen className="w-4 h-4 text-[#00843D] shrink-0" />
                        <div>
                          <p className="text-xs text-[#343A40] leading-none mb-0.5">
                            Seats
                          </p>
                          <p className="font-bold text-[#202124] text-sm">
                            {program.seats}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {program.eligibility && (
                      <div className="flex-1 min-w-0 bg-[#F4F7F5] border border-[#D9E3DC] rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-[#00843D] uppercase tracking-wider mb-1">
                          Eligibility
                        </p>
                        <p className="text-sm text-[#343A40] leading-relaxed line-clamp-2">
                          {program.eligibility}
                        </p>
                      </div>
                    )}
                    {program.overview && (
                      <div className="flex-1 min-w-0 bg-[#F4F7F5] border border-[#D9E3DC] rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-[#00843D] uppercase tracking-wider mb-1">
                          Overview
                        </p>
                        <p className="text-sm text-[#343A40] leading-relaxed line-clamp-2">
                          {program.overview}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {program.accreditation && (
                        <span className="flex items-center gap-1 text-[10px] text-[#00843D] bg-[#E6EEE8] border border-[#00843D]/20 px-2.5 py-1 rounded-full font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          {program.accreditation}
                        </span>
                      )}
                      {program.medium && (
                        <span className="flex items-center gap-1 text-[10px] text-[#00843D] bg-white border border-[#D9E3DC] px-2.5 py-1 rounded-full font-semibold">
                          <Globe className="w-3 h-3" />
                          {program.medium}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-[#00843D] hover:bg-[#006e33] text-white py-2 px-5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-sm group-hover/card:shadow-md pointer-events-none">
                      View Full Details{" "}
                      <ExternalLink className="w-3.5 h-3.5 group-hover/card:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
