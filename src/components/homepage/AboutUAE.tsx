import Link from "next/link";
import {
  Building,
  CheckCircle,
  Clock,
  Globe,
  Languages,
  Users,
  Landmark,
  TrendingUp,
  Map,
  Factory,
} from "lucide-react";
import { getAboutCountryContent } from "@/lib/public-page-content";

export default async function AboutUAE() {
  const content = await getAboutCountryContent();

  const quickFacts = [
    {
      icon: Building,
      label: "Capital",
      value:
        content.summaryStats.find((item) => item.label === "Capital")?.value ||
        "Abu Dhabi",
    },
    {
      icon: Users,
      label: "Population",
      value:
        content.summaryStats.find((item) => item.label === "Population")
          ?.value || "9.5 Million+",
    },
    {
      icon: Languages,
      label: "Languages",
      value:
        content.summaryStats.find((item) => item.label === "Languages")
          ?.value || "Arabic, English",
    },
    {
      icon: Clock,
      label: "Currency",
      value:
        content.summaryStats.find((item) => item.label === "Currency")?.value ||
        "AED",
    },
    {
      icon: Landmark,
      label: "Government",
      value:
        content.summaryStats.find((item) => item.label === "Government")
          ?.value || "Parliamentary democracy",
    },
    {
      icon: TrendingUp,
      label: "GDP per head",
      value:
        content.summaryStats.find((item) => item.label === "GDP per head")
          ?.value || "US$10,300",
    },
    {
      icon: Map,
      label: "Area",
      value:
        content.summaryStats.find((item) => item.label === "Area")?.value ||
        "1860 sq km (725 sq mi)",
    },
    {
      icon: Factory,
      label: "Major Industries",
      value:
        content.summaryStats.find((item) => item.label === "Major Industries")
          ?.value || "Sugar, textiles, tea, tobacco, tourism",
    },
  ];

  return (
    <section className="bg-white py-16 border-b border-[#D9E3DC]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#E6EEE8] border border-[#D9E3DC] px-4 py-1.5 text-xs font-bold text-[#00843D] uppercase tracking-wider">
              Why {content.countryName} for MBBS?
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#202124]">
              {content.heroTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#343A40]">
              {content.heroDescription}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Safe & Student-Friendly Country",
                  description:
                    "UAE offers a peaceful, secure environment with a high quality of life—ideal for international MBBS students.",
                },
                {
                  title: "Globally Aligned Medical Curriculum",
                  description:
                    "Programs follow international standards, preparing students for NEXT (India), USMLE (USA), and PLAB (UK).",
                },
                {
                  title: "Early & Strong Clinical Exposure",
                  description:
                    "Hands-on hospital training with real patient interaction from early years of MBBS.",
                },
                {
                  title: "Affordable MBBS Fees",
                  description:
                    "Study medicine at lower costs compared to the USA, UK, or Australia with excellent ROI.",
                },
                {
                  title: "100% English-Medium Education",
                  description:
                    "No language barrier—entire MBBS course is taught in English.",
                },
                {
                  title: "Easy Visa Process & Travel Access",
                  description:
                    "Simple admission and visa process with direct connectivity from major Indian cities.",
                },
                {
                  title: "Comfortable Lifestyle with Indian Community",
                  description:
                    "Safe living, multicultural environment, and easy access to Indian food and culture.",
                },
                {
                  title: "Internship & Hospital Training",
                  description:
                    "Clinical rotations in government and private hospitals enhance practical learning.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex gap-3 rounded-xl border border-transparent p-2 transition-all duration-300 hover:border-[#D9E3DC] hover:bg-[#F4F7F5]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EEE8] transition-all duration-300 group-hover:bg-[#00843D]">
                    <CheckCircle className="h-5 w-5 text-[#00843D] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202124] text-sm transition-colors duration-300 group-hover:text-[#00843D]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#343A40]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about-uae"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00843D] px-8 py-3.5 font-bold text-white transition-all shadow-sm hover:bg-[#006830] hover:shadow"
              >
                Learn More About {content.countryName}
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-[#D9E3DC] bg-[#F4F7F5] p-8 shadow-sm transition-all duration-500 hover:shadow-md">
              <div className="flex items-center gap-3">
                <Globe className="h-7 w-7 text-[#00843D]" />
                <h3 className="text-2xl font-bold text-[#202124]">
                  Quick Facts
                </h3>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="group relative overflow-hidden rounded-xl bg-white p-4 border border-[#D9E3DC] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00843D] hover:shadow-sm"
                  >
                    <div className="relative flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6EEE8] text-[#00843D] transition-colors duration-300 group-hover:bg-[#00843D] group-hover:text-white">
                        <fact.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#343A40]">
                          {fact.label}
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-[#202124]">
                          {fact.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
