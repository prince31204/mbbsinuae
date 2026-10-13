import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe2,
  GraduationCap,
  Languages,
  Layers3,
  LibraryBig,
  Link2 as LinkIcon,
  School,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getEducationSystemContent } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
  title:
    "Education System in UAE - MBBS Degree Structure | mbbsinuae.com",
  description:
    "Learn about UAE's medical education system, MBBS degree structure, recognition pathways, language support, and academic progression.",
  entitySeo: {
    metaKeyword:
      "UAE education system, mbbs UAE curriculum, UAE medical degree, NMC approved UAE, FMGE UAE",
  },
  path: "/education-system",
  pageKey: "education-system",
});

const themeStyles = {
  red: {
    softPanel: "border-[#D9E3DC] bg-[#F4F7F5]",
    iconWrap: "bg-[#E6EEE8] text-[#00843D]",
    iconHover: "group-hover:bg-[#00843D] group-hover:text-white",
    titleHover: "group-hover:text-[#00843D]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#00843D]",
    pill: "bg-[#E6EEE8] text-[#00843D]",
  },
  blue: {
    softPanel: "border-[#D9E3DC] bg-white",
    iconWrap: "bg-[#E6EEE8] text-[#00843D]",
    iconHover: "group-hover:bg-[#00843D] group-hover:text-white",
    titleHover: "group-hover:text-[#00843D]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#00843D]",
    pill: "bg-[#E6EEE8] text-[#00843D]",
  },
  green: {
    softPanel: "border-[#D9E3DC] bg-[#E6EEE8]/50",
    iconWrap: "bg-[#E6EEE8] text-[#00843D]",
    iconHover: "group-hover:bg-[#00843D] group-hover:text-white",
    titleHover: "group-hover:text-[#00843D]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#00843D]",
    pill: "bg-[#E6EEE8] text-[#00843D]",
  },
  amber: {
    softPanel: "border-[#D9E3DC] bg-white",
    iconWrap: "bg-[#E6EEE8] text-[#00843D]",
    iconHover: "group-hover:bg-[#00843D] group-hover:text-white",
    titleHover: "group-hover:text-[#00843D]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#00843D]",
    pill: "bg-[#E6EEE8] text-[#00843D]",
  },
  purple: {
    softPanel: "border-[#D9E3DC] bg-[#F4F7F5]",
    iconWrap: "bg-[#E6EEE8] text-[#123B2A]",
    iconHover: "group-hover:bg-[#123B2A] group-hover:text-white",
    titleHover: "group-hover:text-[#00843D]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#00843D]",
    pill: "bg-[#E6EEE8] text-[#123B2A]",
  },
} as const;

const summaryIcons = [School, LibraryBig, BookOpen, GraduationCap];
const focusIcons = [BookOpen, School, Globe2, GraduationCap];
const timelineIcons = [Layers3, BookOpen, GraduationCap, LibraryBig];
const detailIcons = [Languages, LibraryBig, GraduationCap, School];

function getLanguageCardIcon(label: string, value: string, detail?: string) {
  const text = `${label} ${value} ${detail ?? ""}`.toLowerCase();

  if (/(english|instruction|school|medium)/.test(text)) return BookOpen;
  if (/(french|international|global|media|commerce)/.test(text)) return Globe2;
  if (/(creole|native|local|bilingual|multilingual|language)/.test(text))
    return Languages;

  return School;
}

export default async function EducationSystemPage() {
  const content = await getEducationSystemContent();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white py-16 text-gray-900 lg:py-20">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-gray-100 hidden" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gray-900/20 hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E3DC] bg-[#E6EEE8] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#00843D] shadow-sm">
              <Globe2 className="h-4 w-4" />
              Education System
            </span>
          </div>
          <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-bold leading-tight lg:text-6xl text-[#202124]">
            Education System in UAE
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-[#343A40] lg:text-xl">
            {content.description}
          </p>
        </div>
      </section>

      <section className="-mt-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {content.summaryStats.map((stat, index) => {
              const Icon = summaryIcons[index % summaryIcons.length];

              return (
                <article
                  key={stat.label}
                  className="group rounded-2xl border border-[#D9E3DC] bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-lg"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6EEE8] text-[#00843D] transition-colors duration-300 group-hover:bg-[#00843D] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#00843D]">
                    {stat.label}
                  </div>
                  <div className="text-xl font-bold text-slate-900 lg:text-2xl">
                    {stat.value}
                  </div>
                  {stat.detail ? (
                    <div className="mt-2 text-sm leading-relaxed text-slate-500">
                      {stat.detail}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="space-y-7">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                Introduction
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">
                Introduction to UAE Education System
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700">
                UAE has one of the most advanced and structured education
                systems in Africa
              </p>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white via-white p-7 shadow-sm">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                Supporting Context
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                What shapes the system today
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Key policy, institutional, and academic influences that define
                how medical education is delivered across the country.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {content.supportingNarrative.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Accreditation
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Main Education Authorities & Accreditations in UAE
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-sm leading-7">
              Explore the regulatory bodies, ministries, and quality assurance
              frameworks that govern both school and higher medical education.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Ministry of Education (MOE) UAE",
                description:
                  "Formulates national educational policies, regulates universities, and oversees higher medical education standards in UAE.",
                role: "University approvals, National curriculum standards, International student policy",
                portal: "https://www.moe.gov.ae/EN/",
                icon: Building2,
                theme: "red",
              },
              {
                title: "Ministry of Health and Welfare (MOHAP)",
                description:
                  "Governs medical colleges, hospital training centers, doctor licensing, and healthcare standards across UAE.",
                role: "Medical licensing, Hospital accreditation, Public healthcare policy",
                portal: "https://www.mohap.gov.ae/en/home/",
                icon: GraduationCap,
                theme: "blue",
              },
              {
                title: "Department of Health - Abu Dhabi",
                description:
                  "Accreditation body officially recognized by WFME and MOHW for medical school quality assessment and curriculum accreditation.",
                role: "Medical school accreditation, WFME compliance, Quality assessment",
                portal: "https://www.doh.gov.ae/en/programs-initiatives/meed",
                subLink: {
                  label: "Department of Health - Abu Dhabi",
                  url: "https://www.doh.gov.ae/en/programs-initiatives/meed",
                },
                icon: ShieldCheck,
                theme: "green",
              },
              {
                title: "National Institute for International Education (NIIED)",
                description:
                  "Government agency under MOE managing the Global UAE Scholarship (GKS) and international student admission frameworks.",
                role: "Study in UAE portal, Government scholarships, International student support",
                portal: "https://niied.go.kr/web/niied/niiedEng/main",
                subLink: {
                  label: "Study in UAE Portal",
                  url: "https://niied.go.kr/web/niied/niiedEng/main",
                },
                icon: Award,
                theme: "amber",
              },
              {
                title: "UAE Health Personnel Licensing Examination Board (KHPLEB)",
                description:
                  "National authority administering medical licensing examinations for physicians, dentists, and health specialists.",
                role: "National medical exam (KMLE), Doctor licensure, Healthcare workforce certification",
                icon: Layers3,
                theme: "purple",
              },
              {
                title: "National Health Insurance Service (NHIS)",
                description:
                  "Comprehensive statutory health insurance system providing universal healthcare and subsidized medical access for students.",
                role: "Student healthcare coverage, Universal health insurance, Clinical system integration",
                portal: "https://www.nhis.or.kr/english/index.do",
                icon: Briefcase,
                theme: "blue",
              },
              {
                title: "Medical Council of UAE (For MBBS)",
                description:
                  "Critical for MBBS students. Registers doctors, recognizes medical degrees, and approves medical colleges.",
                role: "Doctor registration, Degree recognition, Institution approvals",
                portal: "https://www.mohap.gov.ae/en/home",
                icon: Stethoscope,
                theme: "red",
              },
              {
                title: "International Recognition",
                description:
                  "UAE medical degrees are globally accepted, allowing graduates to pursue careers in India, UK, USA, and beyond.",
                role: "WHO (WDOMS), NMC (India), ECFMG (USA), GMC (UK), QAA",
                icon: Globe2,
                theme: "green",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              const styles =
                themeStyles[item.theme as keyof typeof themeStyles];

              return (
                <article
                  key={item.title}
                  className={`group relative flex flex-col h-full overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.softPanel} ${styles.ringHover}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`}
                  />
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3
                        className={`text-base font-bold text-slate-900 leading-snug transition-colors duration-300 ${styles.titleHover}`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-4 space-y-2.5">
                      <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/50">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          Key Role
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-slate-700 leading-relaxed">
                          {item.role}
                        </p>
                      </div>

                      {item.portal ? (
                        <div className="pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Official Website
                          </div>
                          <a
                            href={item.portal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-2 text-sm font-medium text-red-600 hover:text-[#0047A0] transition-colors"
                          >
                            <span className="truncate group-hover/link:underline">
                              {item.portal.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-40 group-hover/link:opacity-100" />
                          </a>
                        </div>
                      ) : null}

                      {(item as any).subLink ? (
                        <div className="pt-2 border-t border-slate-100/50 mt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {(item as any).subLink.label}
                          </div>
                          <a
                            href={(item as any).subLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#0047A0] transition-colors"
                          >
                            <span className="truncate group-hover/link:underline">
                              {(item as any).subLink.url.replace(
                                /^https?:\/\//,
                                "",
                              )}
                            </span>
                            <LinkIcon className="h-2.5 w-2.5 shrink-0 opacity-40 group-hover/link:opacity-100" />
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Academic Progression
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              How the MBBS journey progresses in UAE
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Follow each stage from foundational learning to advanced clinical
              training, with key outcomes at every step.
            </p>
          </div>

          <div className="space-y-4">
            {content.timeline.map((item, index) => {
              const Icon = timelineIcons[index % timelineIcons.length];
              const styles = themeStyles[item.theme];

              return (
                <article
                  key={`${item.label}-${item.title}`}
                  className={`group relative overflow-hidden rounded-[2rem] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.ringHover}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`}
                  />
                  <div className="relative flex flex-col gap-4 lg:flex-row">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles.pill}`}
                        >
                          {item.label}
                        </span>
                        {item.duration ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                            {item.duration}
                          </span>
                        ) : null}
                      </div>

                      <h3
                        className={`mt-3 text-xl font-bold text-slate-900 transition-colors duration-300 ${styles.titleHover}`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {item.description}
                      </p>

                      {item.points.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.points.map((point) => (
                            <span
                              key={point}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {item.meta ? (
                      <div className="min-w-40 rounded-2xl bg-slate-50 p-3.5 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
                        {item.meta}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Degree Pathways
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Programs aligned with UAE medical pathways
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Compare available degree options, course duration, and recognition
              highlights for each academic route.
            </p>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white via-white p-6 shadow-sm lg:p-7">
            <div className="grid gap-3.5 lg:grid-cols-2">
              {content.degreeCards.map((card, index) => {
                const styles =
                  themeStyles[
                  (card.theme ?? "red") as keyof typeof themeStyles
                  ];
                const isMbbsCard = /mbbs|mbchb|medicine/i.test(card.title);
                const Icon = isMbbsCard
                  ? GraduationCap
                  : detailIcons[index % detailIcons.length];

                return (
                  <article
                    key={card.title}
                    className={`group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-slate-100/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.ringHover}`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`}
                    />
                    <div className="relative flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4
                          className={`text-lg font-bold text-slate-900 transition-colors duration-300 ${styles.titleHover}`}
                        >
                          {card.title}
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Instruction
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Languages of instruction
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Understand the primary teaching languages and communication
              support students can expect during training.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.languageCards.map((card, index) => {
              const styles = [
                themeStyles.red,
                themeStyles.blue,
                themeStyles.green,
                themeStyles.purple,
              ][index % 4];
              const Icon = getLanguageCardIcon(
                card.label,
                card.value,
                card.detail,
              );

              return (
                <article
                  key={`${card.label}-${index}`}
                  className={`group relative overflow-hidden rounded-[2rem] border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.softPanel} ${styles.ringHover}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`}
                  />
                  <div className="relative flex h-full flex-col">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                      {card.label}
                    </div>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-900">
                      {card.value}
                    </h3>
                    {card.detail ? (
                      <p className="mt-4 text-base leading-8 text-slate-700">
                        {card.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Network
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Institution mix
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Snapshot of the university and institution ecosystem that supports
              MBBS education in UAE.
            </p>
          </div>
          <div className="space-y-3.5">
            {content.institutionCards.map((card, index) => (
              <article
                key={`${card.label}-${index}`}
                className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:"
              >
                <div className="pointer-events-none absolute inset-0 bg-[#EAF1FB]/10 via-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 group-hover:text-[#0047A0]">
                    {card.label}
                  </div>
                  <div className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                    {card.value}
                  </div>
                  {card.detail ? (
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {card.detail}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Assessments
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Examinations and key academic checkpoints
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Overview of exam stages, subject focus, and milestone checkpoints
              used to track academic progression.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {content.examinations.map((exam) => (
              <article
                key={exam.title}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:"
              >
                <div className="pointer-events-none absolute inset-0 bg-[#EAF1FB]/10 via-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF1FB] text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-gray-900">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#0047A0]">
                      {exam.title}
                    </h3>
                    {exam.gradeLevel ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {exam.gradeLevel}
                      </span>
                    ) : null}
                    {exam.type ? (
                      <span className="rounded-full bg-[#EAF1FB] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0047A0]">
                        {exam.type}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {exam.description}
                  </p>

                  {exam.subjects.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {exam.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#123B2A] to-[#0A2318] py-16 text-white border-t border-[#1D5C42]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold lg:text-4xl text-white">
            Ready to compare universities against this education structure?
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#E6EEE8]">
            Move from general education-system research into live university
            options, fees, and counselling support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00843D] hover:bg-[#006830] px-7 py-3.5 font-semibold text-white transition-all shadow-md"
            >
              Browse Universities
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact-us"
              className="rounded-xl border-2 border-white px-7 py-3.5 font-semibold text-white transition-all hover:bg-white hover:text-[#123B2A]"
            >
              Speak with a Counsellor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
