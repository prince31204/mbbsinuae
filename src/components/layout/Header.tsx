"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, GraduationCap, User } from "lucide-react";

const resourcesMenu = [
  { name: "About Us", path: "/about-us" },
  { name: "Contact Us", path: "/contact-us" },
  { name: "About UAE", path: "/about-uae" },
  { name: "Education System", path: "/education-system" },
  { name: "View Our Partners", path: "/our-partners" },
  { name: "Blog & News", path: "/blog" },
];

function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

export default function Header({
  showScholarship = true,
}: {
  showScholarship?: boolean;
}) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn =
    !!session?.user && (session.user as { role?: string }).role === "student";
  const userInitials = session?.user?.name
    ? getInitials(session.user.name)
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header
      className={`bg-white sticky top-0 z-50 border-b border-[#D9E3DC] transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2.5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-11 h-11 bg-[#00843D] rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#202124] tracking-tight">
                  MBBS in UAE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C8102E]" title="UAE Medical Education" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#343A40] font-medium block -mt-0.5">
                Medical Education Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#202124] hover:text-[#00843D] font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/universities"
              className="text-[#202124] hover:text-[#00843D] font-medium transition-colors"
            >
              Universities
            </Link>
            <Link
              href="/compare"
              className="text-[#202124] hover:text-[#00843D] font-medium transition-colors"
            >
              Compare Universities
            </Link>
            {showScholarship && (
              <Link
                href="/scholarships"
                className="text-[#202124] hover:text-[#00843D] font-medium transition-colors"
              >
                Scholarships
              </Link>
            )}

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center space-x-1 text-[#202124] hover:text-[#00843D] font-medium transition-colors"
                suppressHydrationWarning={true}
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 text-[#343A40]" />
              </button>
              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-xl mt-0 p-3 border border-[#D9E3DC]">
                  <ul className="space-y-1">
                    {resourcesMenu.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className="block px-3 py-2 text-[#343A40] hover:text-[#00843D] hover:bg-[#E6EEE8] rounded-lg text-sm transition-colors font-medium"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative group">
                <Link
                  href="/student"
                  className="w-10 h-10 bg-[#00843D] text-white rounded-full flex items-center justify-center font-semibold hover:bg-[#006830] transition-colors shadow-sm"
                  aria-label="Go to dashboard"
                >
                  {userInitials || <User className="w-5 h-5" />}
                </Link>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white border border-[#D9E3DC] shadow-xl rounded-xl p-2 min-w-[150px]">
                    <Link
                      href="/student"
                      className="block py-2 px-3 text-sm text-[#202124] hover:text-[#00843D] hover:bg-[#E6EEE8] rounded-lg font-medium"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left py-2 px-3 text-sm text-[#202124] hover:text-[#C8102E] hover:bg-[#F4F7F5] rounded-lg font-medium"
                      suppressHydrationWarning={true}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/apply"
                  className="bg-[#00843D] hover:bg-[#006830] text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all text-sm font-semibold"
                >
                  Get Free Counselling
                </Link>
                <Link
                  href="/register"
                  className="border border-[#00843D] text-[#00843D] hover:bg-[#E6EEE8] px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold"
                >
                  Sign-Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#202124] hover:text-[#00843D]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            suppressHydrationWarning={true}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#D9E3DC]">
            <nav className="space-y-3">
              <Link
                href="/"
                onClick={closeMenu}
                className="block text-[#202124] hover:text-[#00843D] font-medium py-1"
              >
                Home
              </Link>
              <Link
                href="/universities"
                onClick={closeMenu}
                className="block text-[#202124] hover:text-[#00843D] font-medium py-1"
              >
                Universities
              </Link>
              <Link
                href="/compare"
                onClick={closeMenu}
                className="block text-[#202124] hover:text-[#00843D] font-medium py-1"
              >
                Compare Universities
              </Link>
              {showScholarship && (
                <Link
                  href="/scholarships"
                  onClick={closeMenu}
                  className="block text-[#202124] hover:text-[#00843D] font-medium py-1"
                >
                  Scholarships
                </Link>
              )}

              {/* Mobile Resources */}
              <div className="py-1">
                <button
                  className="flex items-center justify-between w-full text-[#202124] hover:text-[#00843D] font-medium"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "resources" ? null : "resources",
                    )
                  }
                  suppressHydrationWarning={true}
                >
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4 text-[#343A40]" />
                </button>
                {activeDropdown === "resources" && (
                  <div className="mt-2 pl-3 space-y-2 border-l-2 border-[#00843D]">
                    {resourcesMenu.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={closeMenu}
                        className="block text-[#343A40] hover:text-[#00843D] text-sm py-1 font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/student"
                    onClick={closeMenu}
                    className="block bg-[#E6EEE8] text-[#123B2A] font-semibold px-4 py-2.5 rounded-lg text-center hover:bg-[#d6e3db] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full block bg-white border border-[#D9E3DC] text-[#C8102E] font-medium px-4 py-2.5 rounded-lg text-center"
                    suppressHydrationWarning={true}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 pt-2">
                  <Link
                    href="/apply"
                    onClick={closeMenu}
                    className="block bg-[#00843D] hover:bg-[#006830] text-white px-4 py-3 rounded-lg text-center font-semibold shadow-sm"
                  >
                    Get Free Counselling
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block border border-[#00843D] text-[#00843D] hover:bg-[#E6EEE8] px-4 py-3 rounded-lg text-center font-semibold"
                  >
                    Sign-Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
