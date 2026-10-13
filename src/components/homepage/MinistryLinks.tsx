import { Prisma } from "@prisma/client";
import {
  ExternalLink,
  Building2,
  Globe,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type OfficialGovernmentLink = Prisma.OfficialGovernmentLinkGetPayload<{}>;

type MinistryCard = {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  website: string;
  phone?: string;
  email?: string;
  services: string[];
};

const EMBASSY_INFO = {
  name: "Embassy of the United Arab Emirates in New Delhi, India",
  address: "12, Chandragupta Marg, Chanakyapuri, New Delhi – 110021, India.",
  phone: "+91-11-2611 1111",
  email: "indiaemb@mofaic.gov.ae",
  website: "https://www.mofa.gov.ae/en/missions/new-delhi",
  consular:
    "Consular appointments are handled through official mission channels",
  hours: "Monday to Friday: 9:00 AM - 4:00 PM",
};

const DB_FALLBACK_SERVICES = [
  "Official updates",
  "Policy notices",
  "Compliance information",
  "Reference links",
];

const IMPORTANT_NOTES = [
  "Confirm university recognition from official regulators",
  "Use embassy websites for visa process updates",
  "Cross-check exam and licensing notices from NMC",
];

function normalizeCountryText(value: string): string {
  return value;
}

function normalizeWebsite(url: string): string {
  return url;
}

const FALLBACK_MINISTRIES: MinistryCard[] = [
  {
    id: 1,
    name: "Ministry of Health and Welfare (MOHW) UAE",
    subtitle: "National Healthcare Regulator",
    description:
      "Primary UAE government authority overseeing medical licensing, hospital accreditation, and health policies in the United Arab Emirates.",
    website: "https://www.mohw.go.kr",
    services: [
      "Medical education & hospital accreditation",
      "Healthcare licensing regulation",
      "National Health Insurance (NHIS) oversight",
      "Medical training quality standards",
    ],
  },
  {
    id: 2,
    name: "National Medical Commission India",
    subtitle: "NMC India",
    description:
      "Indian authority for recognition, screening, and licensing pathways for foreign medical graduates.",
    website: "https://www.nmc.org.in",
    phone: "+91-11-4560-9900",
    email: "secretary@nmc.org.in",
    services: [
      "FMGE/NExT pathways",
      "Recognition guidance",
      "Licensing framework",
      "Regulatory advisories",
    ],
  },
  {
    id: 3,
    name: "World Health Organization",
    subtitle: "WHO",
    description:
      "Global public health authority relevant to international medical education reference standards.",
    website: "https://www.who.int",
    phone: "+41-22-791-2111",
    email: "info@who.int",
    services: [
      "Global health standards",
      "Policy frameworks",
      "International collaboration",
      "Public health guidance",
    ],
  },
  {
    id: 4,
    name: "ECFMG (USA)",
    subtitle: "ECFMG",
    description:
      "Certification and pathway authority for international medical graduates in the United States.",
    website: "https://www.ecfmg.org",
    phone: "+1-215-386-5900",
    email: "info@ecfmg.org",
    services: [
      "Certification pathways",
      "Eligibility guidance",
      "Credential verification",
      "US residency screening",
    ],
  },
];

function parseDbServices(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function mapOfficialLinkToCard(link: OfficialGovernmentLink): MinistryCard {
  const rawDescription = (link.description || "").trim();
  const parsedServices = parseDbServices(rawDescription);
  const displayDescription =
    parsedServices.length > 0
      ? "Official government resource for student and institutional guidance."
      : rawDescription ||
      "Official government resource for student and institutional guidance.";

  return {
    id: link.id,
    name: normalizeCountryText(link.name),
    subtitle: normalizeCountryText(link.category || "Official Source"),
    description: normalizeCountryText(displayDescription),
    website: normalizeWebsite(link.url),
    services: (parsedServices.length > 0
      ? parsedServices
      : DB_FALLBACK_SERVICES
    ).map(normalizeCountryText),
  };
}

async function loadMinistryCards(): Promise<MinistryCard[]> {
  try {
    const links = await prisma.officialGovernmentLink.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    });

    if (links.length === 0) {
      return FALLBACK_MINISTRIES;
    }

    return links.map(mapOfficialLinkToCard);
  } catch {
    return FALLBACK_MINISTRIES;
  }
}

export default async function MinistryLinks() {
  const ministries = await loadMinistryCards();

  return (
    <section className="py-16 bg-white border-b border-[#D9E3DC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
            Verification & Accreditation
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] mb-3">
            Official Government Links
          </h2>
          <p className="text-base text-[#343A40] max-w-3xl mx-auto leading-relaxed">
            Direct access to official organizations that matter for MBBS
            admissions, regulatory compliance, and international student support.
          </p>
        </div>

        <div className="bg-[#123B2A] rounded-3xl p-8 mb-10 text-white border border-[#1D5C42] shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D5C42] text-[#E6EEE8] text-xs font-semibold mb-3">
                <span>Diplomatic Mission</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{EMBASSY_INFO.name}</h3>
              <p className="text-[#E6EEE8] mb-6 text-sm leading-relaxed">
                Contact the embassy for official student visa, attestation, and consular guidance before your travel.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 mt-0.5 text-[#00843D] flex-shrink-0" />
                  <span className="text-[#E6EEE8] text-sm">{EMBASSY_INFO.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#00843D] flex-shrink-0" />
                  <span className="text-[#E6EEE8] text-sm">{EMBASSY_INFO.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#00843D] flex-shrink-0" />
                  <span className="text-[#E6EEE8] text-sm">{EMBASSY_INFO.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-[#00843D] flex-shrink-0" />
                  <a
                    href={EMBASSY_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E6EEE8] hover:text-white underline underline-offset-2 transition-colors text-sm"
                  >
                    {EMBASSY_INFO.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold mb-1 text-white">Office Hours</h4>
              <p className="text-[#E6EEE8] text-sm mb-4">{EMBASSY_INFO.hours}</p>
              <h4 className="text-lg font-bold mb-1 text-white">Consular Services</h4>
              <p className="text-[#E6EEE8] text-sm mb-6">{EMBASSY_INFO.consular}</p>
              <a
                href={EMBASSY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#00843D] hover:bg-[#006830] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md text-center"
              >
                Contact Embassy Portal
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {ministries.map((ministry) => (
            <div
              key={ministry.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#D9E3DC] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-xl"
            >
              <div className="border-b border-[#D9E3DC] bg-[#F4F7F5] p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#E6EEE8] text-[#00843D] transition-all duration-300 group-hover:bg-[#00843D] group-hover:text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-bold text-[#202124] transition-colors duration-300 group-hover:text-[#00843D]">
                      {ministry.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#00843D] mb-1.5">
                      {ministry.subtitle}
                    </p>
                    <p className="text-sm text-[#343A40] leading-relaxed">{ministry.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-6">
                  <h4 className="font-bold text-[#202124] text-sm mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                      <a
                        href={ministry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00843D] hover:underline transition-colors text-sm font-medium"
                      >
                        {ministry.website}
                      </a>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    {ministry.phone ? (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                        <span className="text-[#343A40] text-sm">
                          {ministry.phone}
                        </span>
                      </div>
                    ) : null}
                    {ministry.email ? (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                        <span className="text-[#343A40] text-sm">
                          {ministry.email}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <h4 className="font-bold text-[#202124] text-sm mb-3">
                    Key Services
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {ministry.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00843D] rounded-full flex-shrink-0" />
                        <span className="text-[#343A40] text-xs leading-relaxed">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <a
                    href={ministry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#00843D] hover:bg-[#006830] py-3 font-semibold text-white transition-all shadow-sm group-hover:shadow"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#E6EEE8] border border-[#D9E3DC] rounded-3xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="w-5 h-5 text-[#00843D]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#123B2A] mb-2">
                Important Student Guidance Notice
              </h3>
              <p className="text-[#202124] mb-4 text-sm leading-relaxed">
                Always verify regulatory guidelines, licensing frameworks, and university equivalency directly through official UAE government portals before finalizing admissions.
              </p>
              <ul className="space-y-2 text-[#343A40] text-sm">
                {IMPORTANT_NOTES.map((item) => (
                  <li key={item} className="flex items-start space-x-2.5">
                    <div className="w-1.5 h-1.5 bg-[#00843D] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
