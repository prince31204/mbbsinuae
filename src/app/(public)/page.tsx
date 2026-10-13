import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/homepage/HeroSection";
import UniversityGrid from "@/components/homepage/UniversityGrid";
import UniversityMapSection from "@/components/homepage/UniversityMapSection";
import AboutUAE from "@/components/homepage/AboutUAE";
import ScholarshipsSection from "@/components/homepage/ScholarshipsSection";
import EducationSystem from "@/components/homepage/EducationSystem";
import MinistryLinks from "@/components/homepage/MinistryLinks";
import CompareUniversities from "@/components/homepage/CompareUniversities";
import FmgeSection from "@/components/homepage/FmgeSection";
import HomepageFAQ from "@/components/homepage/HomepageFAQ";
import { homepageFaqs } from "@/lib/homepage-faqs";
import {
  organizationSchema,
  buildMetadata,
  faqSchema,
  APP_YEAR,
  ADMISSION_YEAR,
} from "@/lib/seo";
import { getHomepageStats, getHomepageFaqs } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
  title: `MBBS in UAE ${APP_YEAR} | NMC Recognised Universities | Fees & Admission for Indian Students`,
  description: `Explore top NMC-recognised medical universities in UAE. Compare fees, FMGE rates, and apply for MBBS ${APP_YEAR} admission. Free counselling for Indian students.`,
  path: "/",
  pageKey: "home",
  entitySeo: {
    metaKeyword: `MBBS in UAE, study MBBS UAE, medical university UAE, NMC recognized UAE, MBBS admission ${APP_YEAR}, low fee MBBS abroad`,
  },
});

const UniversityGridFallback = () => (
  <section className="py-8 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AdmissionProcess = () => (
  <section className="py-16 bg-[#F4F7F5] border-b border-[#D9E3DC]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
          Step-By-Step Journey
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">Admission Process</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#00843D] -translate-y-1/2 z-0" />
        {[
          { step: "01", title: "Eligibility Assessment" },
          { step: "02", title: "University Selection" },
          { step: "03", title: "Application & Documentation" },
          { step: "04", title: "Admission Decision" },
          { step: "05", title: "Visa Guidance" },
          { step: "06", title: "Travel & Enrollment" },
        ].map((s, i) => (
          <div key={i} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 mb-8 md:mb-0 bg-white md:px-3 py-2 rounded-xl border border-[#D9E3DC] shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-[#00843D] text-white flex items-center justify-center font-bold text-lg group-hover:bg-[#123B2A] transition-colors shadow-md">
              {s.step}
            </div>
            <div className="text-[#202124] font-semibold md:text-center text-sm max-w-[120px]">
              {s.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EligibilitySection = () => (
  <section className="py-16 bg-white border-b border-[#D9E3DC]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
          Requirements
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">MBBS in UAE – Eligibility</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: "Academic Requirements", desc: "10+2 or equivalent with Physics, Chemistry, and Biology." },
          { title: "Minimum Marks", desc: "At least 50% aggregate in PCB (40% for reserved categories)." },
          { title: "Age Limit", desc: "Must be 17 years old by December 31st of the admission year." },
          { title: "Language Proficiency", desc: "English proficiency. Entire medical curriculum is taught in English." },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-6 rounded-2xl bg-[#F4F7F5] border border-[#D9E3DC] hover:border-[#00843D] hover:shadow-md transition-all">
            <div className="w-7 h-7 rounded-full bg-[#E6EEE8] text-[#00843D] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
            <div>
              <h3 className="font-bold text-[#202124] text-lg mb-1">{item.title}</h3>
              <p className="text-[#343A40] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeesSection = () => (
  <section className="py-16 bg-[#F4F7F5] border-b border-[#D9E3DC]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
          Transparent Costs
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">MBBS in UAE Fees</h2>
        <p className="mt-2 text-[#343A40]">Estimated cost structure for international medical students.</p>
      </div>
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#D9E3DC]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D9E3DC]">
          <div className="p-8 text-center">
            <div className="text-[#00843D] font-bold text-xs uppercase tracking-wider mb-2">Average Tuition Fee</div>
            <div className="text-3xl font-extrabold text-[#202124]">$5,000 - $10,000</div>
            <div className="text-xs text-[#343A40] mt-1.5">Per Academic Year</div>
          </div>
          <div className="p-8 text-center">
            <div className="text-[#00843D] font-bold text-xs uppercase tracking-wider mb-2">Living Expenses</div>
            <div className="text-3xl font-extrabold text-[#202124]">$400 - $800</div>
            <div className="text-xs text-[#343A40] mt-1.5">Estimated Per Month</div>
          </div>
          <div className="p-8 text-center bg-[#E6EEE8]/40">
            <div className="text-[#123B2A] font-bold text-xs uppercase tracking-wider mb-2">Total Estimated Budget</div>
            <div className="text-3xl font-extrabold text-[#00843D]">Affordable</div>
            <div className="text-xs text-[#343A40] mt-1.5 font-medium">High ROI on Medical Education</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StudentLifeSection = () => (
  <section className="py-16 bg-white overflow-hidden relative border-b border-[#D9E3DC]">
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
          Campus Life
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">Experience Student Life in UAE</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Modern Campus", desc: "State-of-the-art facilities, digital anatomy labs, and accredited teaching hospitals." },
          { title: "Cultural Integration", desc: "Experience the safe, cosmopolitan, and welcoming culture of the UAE." },
          { title: "International Community", desc: "Study alongside diverse students from India and over 80 countries worldwide." },
        ].map((item, i) => (
          <div key={i} className="bg-[#123B2A] rounded-2xl p-8 text-white relative overflow-hidden group border border-[#1D5C42] shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00843D]/25 rounded-full blur-2xl group-hover:bg-[#00843D]/40 transition-colors" />
            <h3 className="text-xl font-bold mb-3 relative z-10 text-white">{item.title}</h3>
            <p className="text-[#E6EEE8] text-sm leading-relaxed relative z-10">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ConsultancyServicesSection = () => (
  <section className="py-16 bg-[#F4F7F5] border-b border-[#D9E3DC]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
          End-to-End Guidance
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">Our Consultancy Services</h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { title: "University Selection" },
          { title: "Application Assistance" },
          { title: "Documentation Guidance" },
          { title: "Admission Support" },
          { title: "Visa & Travel Guidance" },
          { title: "Post-Arrival Support" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#D9E3DC] flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-[#E6EEE8] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00843D] transition-colors">
              <span className="text-[#00843D] font-bold text-xl group-hover:text-white transition-colors">{i+1}</span>
            </div>
            <h3 className="font-bold text-[#202124]">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CtaSection = () => (
  <section className="py-20 bg-[#123B2A] relative overflow-hidden border-t border-[#1D5C42]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#00843D] to-[#123B2A] rounded-full opacity-30 blur-3xl mix-blend-screen" />
    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D5C42] border border-[#1D5C42] text-[#E6EEE8] text-xs font-semibold uppercase tracking-wider mb-6">
        <span>Expert Counselling</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Start Your MBBS Journey in UAE</h2>
      <p className="text-lg md:text-xl text-[#E6EEE8] mb-10 max-w-2xl mx-auto">Get personalized guidance for choosing the right UAE medical university, fee planning, document verification, and admission counseling.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/apply" className="bg-[#00843D] hover:bg-[#006830] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
          Get Free Counselling
        </a>
        <a href="/universities" className="bg-white hover:bg-[#E6EEE8] text-[#123B2A] px-8 py-4 rounded-xl font-bold transition-all shadow-md">
          Explore Universities
        </a>
      </div>
    </div>
  </section>
);

export default async function HomePage() {
  const [stats, faqs, visibility] = await Promise.all([
    getHomepageStats(),
    getHomepageFaqs(),
    prisma.websiteSetting
      .findUnique({ where: { key: "scholarship_visibility" } })
      .catch(() => null),
  ]);

  const showScholarship = visibility?.value !== "false";

  const jsonLd = [organizationSchema(), faqSchema(faqs)];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sections */}
      <HeroSection stats={stats} />
      <Suspense fallback={<UniversityGridFallback />}>
        <UniversityGrid />
      </Suspense>

      <Suspense fallback={<div className="py-16 bg-white mb-2" />}>
        <UniversityMapSection />
      </Suspense>

      <AboutUAE />
      <AdmissionProcess />
      <EligibilitySection />
      <FeesSection />
      <StudentLifeSection />
      <ConsultancyServicesSection />

      <Suspense fallback={<div className="py-16 bg-gray-50" />}>
        <CompareUniversities />
      </Suspense>

      {showScholarship && (
        <Suspense fallback={<div className="py-16 bg-white" />}>
          <ScholarshipsSection stats={stats} />
        </Suspense>
      )}

      <Suspense fallback={<div className="py-16 bg-white" />}>
        <FmgeSection />
      </Suspense>
      <EducationSystem />
      <MinistryLinks />
      <HomepageFAQ dynamicFaqs={faqs} />
      <CtaSection />
    </>
  );
}
