import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Languages,
  LibraryBig,
} from "lucide-react";
import { getEducationSystemContent } from "@/lib/public-page-content";

const themeStyles = {
  red: "border-[#D9E3DC] bg-white hover:border-[#00843D]",
  blue: "border-[#D9E3DC] bg-white hover:border-[#00843D]",
  green: "border-[#D9E3DC] bg-[#E6EEE8]/40 hover:border-[#00843D]",
  amber: "border-[#D9E3DC] bg-white hover:border-[#00843D]",
  purple: "border-[#D9E3DC] bg-white hover:border-[#00843D]",
} as const;

export default async function EducationSystem() {
  const content = await getEducationSystemContent();

  return (
    <section id="education-system" className="bg-[#F4F7F5] py-20 border-b border-[#D9E3DC]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
            Academic Framework
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">{content.title}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-[#343A40] leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#D9E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEE8] flex items-center justify-center text-[#00843D]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124]">
                {content.introductionTitle}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#343A40]">
              {content.introductionDescription}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.summaryStats.map((stat) => (
                <article
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl bg-[#F4F7F5] p-5 border border-[#D9E3DC] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00843D] hover:shadow-sm"
                >
                  <div className="relative">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#343A40]">
                      {stat.label}
                    </div>
                    <div className="mt-1.5 text-2xl font-extrabold text-[#202124]">
                      {stat.value}
                    </div>
                    {stat.detail ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-[#343A40]">
                        {stat.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#D9E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEE8] flex items-center justify-center text-[#00843D]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124]">Focus Areas</h3>
            </div>
            <div className="mt-6 space-y-3.5">
              {content.focusAreas.slice(0, 4).map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl bg-[#F4F7F5] p-4.5 border border-[#D9E3DC] transition-all duration-300 hover:border-[#00843D] hover:shadow-sm p-4"
                >
                  <div className="relative">
                    <h4 className="text-base font-bold text-[#202124] transition-colors duration-300 group-hover:text-[#00843D]">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#343A40]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.timeline.slice(0, 3).map((item) => (
            <article
              key={`${item.label}-${item.title}`}
              className={`group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${themeStyles[item.theme]}`}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#00843D]">
                {item.label}
              </div>
              <h3 className="mt-1.5 text-lg font-bold text-[#202124]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#343A40]">
                {item.description}
              </p>
              {item.points.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {item.points.slice(0, 4).map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-xs text-[#343A40]"
                    >
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00843D]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#D9E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEE8] flex items-center justify-center text-[#00843D]">
                <Languages className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124]">
                Language Support
              </h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.languageCards.map((card, index) => (
                <article
                  key={`${card.label}-${index}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#F4F7F5] p-4.5 border border-[#D9E3DC] transition-all duration-300 hover:border-[#00843D] p-4"
                >
                  <div className="relative">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#00843D]">
                      {card.label}
                    </div>
                    <div className="mt-1.5 text-lg font-bold text-[#202124]">
                      {card.value}
                    </div>
                    {card.detail ? (
                      <p className="mt-1 text-xs leading-relaxed text-[#343A40]">
                        {card.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#D9E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEE8] flex items-center justify-center text-[#00843D]">
                <LibraryBig className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124]">
                Institution Mix
              </h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.institutionCards.map((card, index) => (
                <article
                  key={`${card.label}-${index}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#F4F7F5] p-4.5 border border-[#D9E3DC] transition-all duration-300 hover:border-[#00843D] p-4"
                >
                  <div className="relative">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#343A40]">
                      {card.label}
                    </div>
                    <div className="mt-1.5 text-lg font-bold text-[#202124]">
                      {card.value}
                    </div>
                    {card.detail ? (
                      <p className="mt-1 text-xs leading-relaxed text-[#343A40]">
                        {card.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/education-system"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#00843D] bg-white px-8 py-3.5 font-bold text-[#00843D] transition-all shadow-sm hover:bg-[#00843D] hover:text-white"
          >
            Learn More About the Education System
          </Link>
        </div>
      </div>
    </section>
  );
}
