import Link from "next/link";
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

const quickLinks = [
  { name: "Universities", path: "/universities" },
  { name: "About UAE", path: "/about-uae" },
  { name: "Compare Universities", path: "/compare" },
  { name: "Education System", path: "/education-system" },
  { name: "Contact Us", path: "/contact-us" },
];

const services = [
  { name: "Admission Assistance", href: "/apply" },
  { name: "Application Guide", href: "/apply" },
  { name: "Visa Support", href: "/contact-us" },
  { name: "Accommodation Help", href: "/contact-us" },
  { name: "Career Guidance", href: "/contact-us" },
];

const resources = [
  { name: "Application Guide", href: "/apply" },
  { name: "Scholarship Guide", href: "/scholarships" },
  { name: "Country Information", href: "/about-uae" },
  { name: "FMGE Pass Rates", href: "/fmge-rates" },
  { name: "Sitemap", href: "/sitemap.xml" },
];

export default async function Footer() {
  // Fetch top 5 universities
  const topUnis = await prisma.university
    .findMany({
      where: { status: true },
      select: { name: true, slug: true },
      take: 5,
      orderBy: { isFeatured: "desc" },
    })
    .catch(() => []);

  const universities = [
    ...topUnis.map((u) => ({ name: u.name, href: `/universities/${u.slug}` })),
    { name: "View All Universities", href: "/universities" },
  ];

  return (
    <footer className="bg-[#123B2A] text-white border-t border-[#1D5C42]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#00843D] rounded-xl flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-white tracking-tight">MBBS in UAE</h3>
                  <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                </div>
                <p className="text-[11px] text-[#E6EEE8]/75 uppercase tracking-wider">Medical Consultancy</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                <span className="text-[#E6EEE8] text-sm">+91-9818 560 331</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                <span className="text-[#E6EEE8] text-sm">
                  info@mbbsinuae.com
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#00843D] flex-shrink-0 mt-0.5" />
                <span className="text-[#E6EEE8] text-sm leading-relaxed">
                  B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram,
                  Haryana 122018
                </span>
              </div>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-semibold mb-3 text-white uppercase tracking-wider">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  {
                    Icon: Facebook,
                    href: "https://facebook.com/mbbsinuae",
                    label: "Facebook",
                  },
                  {
                    Icon: Twitter,
                    href: "https://twitter.com/mbbsinuae",
                    label: "Twitter",
                  },
                  {
                    Icon: Instagram,
                    href: "https://instagram.com/mbbsinuae",
                    label: "Instagram",
                  },
                  {
                    Icon: Youtube,
                    href: "https://youtube.com/@mbbsinuae",
                    label: "YouTube",
                  },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-[#1D5C42] text-white rounded-lg flex items-center justify-center hover:bg-[#00843D] hover:scale-105 transition-all shadow-sm"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white pb-1.5 border-b border-[#1D5C42]">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-[#E6EEE8] hover:text-[#00843D] hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white pb-1.5 border-b border-[#1D5C42]">Top Universities</h4>
            <ul className="space-y-2.5">
              {universities.map((u, index) => (
                <li key={index}>
                  <Link
                    href={u.href}
                    className="text-[#E6EEE8] hover:text-[#00843D] hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {u.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white pb-1.5 border-b border-[#1D5C42]">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="text-[#E6EEE8] hover:text-[#00843D] hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white pb-1.5 border-b border-[#1D5C42]">Resources</h4>
            <ul className="space-y-2.5">
              {resources.map((r) => (
                <li key={r.name}>
                  <Link
                    href={r.href}
                    className="text-[#E6EEE8] hover:text-[#00843D] hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#1D5C42]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-[#E6EEE8]/80 text-sm">
              © {new Date().getFullYear()} MBBS in UAE | Official Partner for UAE Medical Admissions
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-[#E6EEE8] hover:text-[#00843D] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-[#E6EEE8] hover:text-[#00843D] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-[#E6EEE8] hover:text-[#00843D] transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
