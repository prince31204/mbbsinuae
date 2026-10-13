"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Globe,
  Award,
  Building2,
  Stethoscope,
} from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";
import { HomePageStats } from "@/lib/public-page-content";

const FALLBACK_BROCHURE = "/brochures/UAE_university.pdf";

interface HeroSectionProps {
  stats: HomePageStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const { openModal } = useDownloadModal();

  return (
    <section id="home" className="relative bg-gradient-to-b from-[#F4F7F5] via-[#FFFFFF] to-[#F4F7F5] border-b border-[#D9E3DC] overflow-hidden">
      {/* Subtle UAE ambient decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00843D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C8102E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E6EEE8] border border-[#D9E3DC] text-[#00843D]">
                <Globe className="w-4 h-4 text-[#00843D]" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  Official Partner of Top UAE Medical Universities
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#202124] tracking-tight">
                Study MBBS in <span className="text-[#00843D]">UAE</span>
              </h1>

              <p className="text-lg lg:text-xl text-[#343A40] leading-relaxed">
                Explore globally accredited medical universities in the United Arab Emirates with affordable fees, 100% English-medium curriculum, advanced clinical hospital rotations, and a structured pathway to practicing medicine internationally.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/universities"
                className="bg-[#00843D] hover:bg-[#006830] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Universities</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={() => openModal("MBBS in UAE", FALLBACK_BROCHURE)}
                className="border-2 border-[#00843D] bg-white text-[#00843D] hover:bg-[#E6EEE8] px-8 py-4 rounded-xl font-bold transition-colors cursor-pointer shadow-sm"
                suppressHydrationWarning={true}
              >
                Download Brochure
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#D9E3DC]">
              {[
                {
                  value: stats.universities,
                  label: "Top Medical Universities",
                },
                { value: stats.students, label: "Indian Students" },
                { value: stats.admissionSupport, label: "Admission Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-3xl font-extrabold text-[#00843D]">
                    {stat.value}
                  </div>
                  <div className="text-[#343A40] text-xs sm:text-sm font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 space-y-6 relative z-10 border border-[#D9E3DC] shadow-xl">
              <div className="border-b border-[#D9E3DC] pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-2xl font-bold text-[#202124]">Why Choose UAE?</h3>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#E6EEE8] text-[#00843D]">
                    UAE Advantage
                  </span>
                </div>
                <p className="text-sm text-[#343A40]">
                  Graduates can apply for medical registration through UAE health authorities and practice globally.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <Stethoscope className="w-6 h-6 text-[#00843D]" />,
                    title: "Internship & Hospital Training Opportunities",
                    desc: "Clinical rotations in modern government and private hospitals enhance practical surgical and diagnostic skills.",
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-[#00843D]" />,
                    title: "Curriculum Aligned with Global Standards",
                    desc: "Medical programs follow international standards, preparing students for exams like NEXT (India), USMLE (USA), and PLAB (UK).",
                  },
                  {
                    icon: <Award className="w-6 h-6 text-[#00843D]" />,
                    title: "Strong Internship & Licensing Pathways",
                    desc: "Opportunity to complete internships and explore direct licensing avenues across the UAE healthcare ecosystem.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-[#F4F7F5] transition-colors">
                    <div className="w-12 h-12 bg-[#E6EEE8] rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#202124] mb-1 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-[#343A40] text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle card backdrop styling */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00843D]/10 to-[#E6EEE8] rounded-[2rem] -z-0 blur-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
