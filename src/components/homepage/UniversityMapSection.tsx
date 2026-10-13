import { prisma } from "@/lib/prisma";
import UniversityMapWrapper from "./UniversityMapWrapper";

export default async function UniversityMapSection() {
  const universities = await prisma.university
    .findMany({
      where: {
        status: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        latitude: true,
        longitude: true,
        thumbnailPath: true,
      },
    })
    .catch(() => []);

  // Always render the map to show the section even if no universities exist
  // if (universities.length === 0) {
  //   return null;
  // }

  const mapData = universities.map((u) => ({
    ...u,
    latitude: u.latitude ? Number(u.latitude) : null,
    longitude: u.longitude ? Number(u.longitude) : null,
  }));

  return (
    <section
      className="bg-[#F4F7F5] overflow-hidden relative"
      id="university-map"
    >
      {/* Heading above the map */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="text-center">
          <span className="inline-block bg-[#E6EEE8] text-[#00843D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-[#00843D]/20">
            Interactive Map
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#202124] mb-3">
            Universities Across UAE
          </h2>
          <p className="text-[#343A40] max-w-xl mx-auto text-base">
            Discover top MBBS universities across UAE with our interactive
            map—compare locations, explore campuses, and choose the right
            medical college for your global career.
          </p>
        </div>
      </div>

      {/* Full-width map container */}
      <div className="w-full px-4 pb-14 max-w-7xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden shadow-xl border border-[#D9E3DC]"
          style={{ zIndex: 0, position: "relative" }}
        >
          <UniversityMapWrapper universities={mapData} />
        </div>
      </div>
    </section>
  );
}
