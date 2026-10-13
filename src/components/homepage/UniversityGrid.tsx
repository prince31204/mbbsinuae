import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star, ArrowRight, Award, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "medical":
      return "bg-[#E6EEE8] text-[#00843D] font-semibold";
    case "technical":
      return "bg-[#E6EEE8] text-[#123B2A] font-semibold";
    case "private":
      return "bg-slate-100 text-[#202124] font-semibold";
    case "public":
      return "bg-[#E6EEE8] text-[#00843D] font-semibold";
    default:
      return "bg-gray-100 text-[#343A40] font-medium";
  }
}

function formatStudents(students: string | null | undefined): string {
  if (!students) return "N/A";
  return students; // Show exactly what admin entered — no extra + appended
}

export default async function UniversityGrid() {
  let universities = await prisma.university
    .findMany({
      where: { status: true, homeView: true },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailPath: true,
        rating: true,
        city: true,
        state: true,
        students: true,
        tuitionFee: true,
        establishedYear: true,
        approvedBy: true,
        scholarshipName: true,
        instituteType: { select: { name: true } },
        province: { select: { name: true } },
        cityRelation: { select: { name: true } },
      },
      orderBy: { id: "asc" },
      take: 6,
    })
    .catch(() => []);

  // Fallback un-curated universities if the admin hasn't enabled homeView yet
  if (universities.length === 0) {
    universities = await prisma.university
      .findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnailPath: true,
          rating: true,
          city: true,
          state: true,
          students: true,
          tuitionFee: true,
          establishedYear: true,
          approvedBy: true,
          scholarshipName: true,
          instituteType: { select: { name: true } },
          province: { select: { name: true } },
          cityRelation: { select: { name: true } },
        },
        orderBy: [{ rating: "desc" }, { id: "asc" }],
        take: 6,
      })
      .catch(() => []);
  }

  return (
    <section className="py-16 bg-[#F4F7F5] border-b border-[#D9E3DC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#E6EEE8] text-[#00843D] text-xs font-bold uppercase tracking-wider mb-2">
            Top Institutions
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] mb-3">
            Top Medical Universities in UAE
          </h2>
          <p className="text-base text-[#343A40] max-w-4xl mx-auto leading-relaxed">
            Practicing medicine in UAE is a structured and transparent process regulated by the Medical Authorities of UAE.
            International students who complete their MBBS in UAE or from a recognized university abroad can apply for registration and begin their medical career in the country.
          </p>
        </div>

        {universities.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-[#D9E3DC] overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-16 bg-gray-200 rounded" />
                    <div className="h-16 bg-gray-200 rounded" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${universities.length < 3 ? "flex flex-wrap justify-center" : "grid md:grid-cols-2 lg:grid-cols-3"} gap-8`}
          >
            {universities.map((university, index) => {
              const approvedBy = Array.isArray(university.approvedBy)
                ? (university.approvedBy as string[])
                : ["WHO", "NMC"];

              return (
                <Link
                  key={university.id}
                  href={`/universities/${university.slug}`}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#D9E3DC] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00843D] hover:shadow-xl ${universities.length < 3 ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md" : ""}`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={
                        cdn(university.thumbnailPath) ||
                        "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600"
                      }
                      alt={`MBBS students campus at ${university.name}, UAE`}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    {university.instituteType && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${getTypeColor(university.instituteType.name)}`}
                        >
                          {university.instituteType.name}
                        </span>
                      </div>
                    )}
                    {university.rating && (
                      <div className="absolute top-3.5 right-3.5 z-10 flex items-center space-x-1 rounded-lg bg-white/95 px-2.5 py-1 shadow-sm border border-[#D9E3DC]">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span className="text-xs font-bold text-[#202124]">
                          {Number(university.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative flex flex-grow flex-col p-6">
                    <div className="mb-4">
                      <h3 className="mb-1.5 text-xl font-bold text-[#202124] transition-colors duration-300 group-hover:text-[#00843D] line-clamp-1">
                        {university.name}
                      </h3>
                      <div className="flex items-center text-xs text-[#343A40] transition-colors">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#00843D] shrink-0" />
                        <span className="truncate">
                          {university.cityRelation?.name ||
                            university.city ||
                            "UAE"}
                          {university.province?.name
                            ? `, ${university.province.name}`
                            : ""}
                        </span>
                        {university.establishedYear && (
                          <>
                            <span className="mx-1.5">•</span>
                            <span>Est. {university.establishedYear}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl bg-[#F4F7F5] border border-[#D9E3DC]/70 p-3 text-center transition-all duration-300 group-hover:bg-[#E6EEE8]/50">
                        <Users className="mx-auto mb-1 h-4 w-4 text-[#00843D]" />
                        <div className="text-sm font-bold text-[#202124]">
                          {formatStudents(university.students)}
                        </div>
                        <div className="text-[11px] text-[#343A40]">Students</div>
                      </div>
                      <div className="rounded-xl bg-[#F4F7F5] border border-[#D9E3DC]/70 p-3 text-center transition-all duration-300 group-hover:bg-[#E6EEE8]/50">
                        <Award className="mx-auto mb-1 h-4 w-4 text-[#00843D]" />
                        <div className="text-sm font-bold text-[#00843D]">
                          {university.tuitionFee
                            ? /[a-zA-Z]/.test(String(university.tuitionFee))
                              ? String(university.tuitionFee)
                              : `${String(university.tuitionFee)} USD`
                            : "Contact for details"}
                        </div>
                        <div className="text-[11px] text-[#343A40]">Annual Fees</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="mb-3.5 flex flex-wrap gap-1.5">
                      {university.scholarshipName && (
                        <span className="rounded-md bg-[#E6EEE8] border border-[#D9E3DC] px-2 py-0.5 text-xs font-semibold text-[#00843D]">
                          {university.scholarshipName}
                        </span>
                      )}
                      {university.instituteType && (
                        <span className="rounded-md bg-[#F4F7F5] border border-[#D9E3DC] px-2 py-0.5 text-xs font-medium text-[#343A40]">
                          {university.instituteType.name}
                        </span>
                      )}
                    </div>

                    {/* Recognition */}
                    <div className="mb-5 flex-grow">
                      <div className="flex items-center space-x-1.5 text-xs text-[#343A40]">
                        <Globe className="w-3.5 h-3.5 text-[#00843D] shrink-0" />
                        <span className="truncate">
                          Recognized by: {approvedBy.slice(0, 3).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <div className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#00843D] py-3 font-semibold text-white shadow-sm transition-all duration-300 group-hover:bg-[#006830] group-hover:shadow-md">
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/universities"
            className="inline-block bg-white text-[#00843D] border-2 border-[#00843D] hover:bg-[#00843D] hover:text-white px-8 py-4 rounded-xl font-bold transition-all shadow-sm"
          >
            View All Universities
          </Link>
        </div>
      </div>
    </section>
  );
}
