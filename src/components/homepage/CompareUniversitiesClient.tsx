"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cdn } from "@/lib/cdn";

interface Uni {
  id: number;
  name: string;
  slug: string;
  thumbnailPath: string | null;
  rating: unknown;
  city: string | null;
  students: string | null;
  tuitionFee: unknown;
  establishedYear: number | null;
  courseDuration: string | null;
  mediumOfInstruction: string | null;
  whoListed: boolean | null;
  nmcApproved: boolean | null;
  ministryLicensed: boolean | null;
  faimerListed: boolean | null;
  mciRecognition: boolean | null;
  ecfmgEligible: boolean | null;
  fmgePassRate: unknown;
  neetRequirement: string | null;
  eligibility: string | null;
  globalRanking: string | null;
  campusArea: string | null;
  labs: number | null;
  lectureHall: number | null;
  hostelBuilding: number | null;
  countriesRepresented: number | null;
  instituteType: { name: string } | null;
  cityRelation: { name: string } | null;
}

const FEATURES = [
  { key: "location", label: "Location" },
  { key: "established", label: "Established" },
  { key: "rating", label: "Rating" },
  { key: "students", label: "Total Students" },
  { key: "fee", label: "Annual Fees" },
  { key: "duration", label: "Course Duration" },
  { key: "type", label: "Institute Type" },
  { key: "medium", label: "Medium of Instruction" },
  { key: "recognition", label: "Recognition" },
  { key: "neet", label: "NEET Requirement" },
  { key: "eligibility", label: "Eligibility" },
  { key: "globalRanking", label: "Global Ranking" },
  { key: "campusArea", label: "Campus Area" },
  { key: "labs", label: "Labs" },
  { key: "lectureHall", label: "Lecture Halls" },
  { key: "hostelBuilding", label: "Hostel Buildings" },
  { key: "countriesRepresented", label: "Countries Represented" },
];

function getValue(u: Uni, key: string): string {
  switch (key) {
    case "location":
      return u.cityRelation?.name || u.city || "N/A";
    case "established":
      return u.establishedYear?.toString() || "N/A";
    case "rating":
      return u.rating ? `★ ${Number(u.rating).toFixed(1)}` : "N/A";
    case "students":
      return u.students ? `${u.students}` : "N/A";
    case "fee":
      return u.tuitionFee ? String(u.tuitionFee) : "N/A";
    case "duration":
      return u.courseDuration || "N/A";
    case "type":
      return u.instituteType?.name || "N/A";
    case "medium":
      return u.mediumOfInstruction || "N/A";
    case "recognition": {
      const r = [];
      if (u.whoListed) r.push("WHO");
      if (u.nmcApproved) r.push("NMC");
      if (u.ministryLicensed) r.push("Ministry");
      if (u.faimerListed) r.push("FAIMER");
      if (u.mciRecognition) r.push("MCI");
      if (u.ecfmgEligible) r.push("ECFMG");
      return r.join(", ") || "N/A";
    }
    case "fmge":
      return u.fmgePassRate ? `${Number(u.fmgePassRate)}%` : "N/A";
    case "neet":
      return u.neetRequirement || "N/A";
    case "eligibility":
      return u.eligibility || "N/A";
    case "globalRanking":
      return u.globalRanking ? `#${u.globalRanking}` : "N/A";
    case "campusArea":
      return u.campusArea || "N/A";
    case "labs":
      return u.labs?.toString() || "N/A";
    case "lectureHall":
      return u.lectureHall?.toString() || "N/A";
    case "hostelBuilding":
      return u.hostelBuilding?.toString() || "N/A";
    case "countriesRepresented":
      return u.countriesRepresented?.toString() || "N/A";
    default:
      return "N/A";
  }
}

export default function CompareUniversitiesClient({
  allUniversities,
}: {
  allUniversities: Uni[];
}) {
  // Default: first 3 universities
  const [selectedIds, setSelectedIds] = useState<number[]>(
    allUniversities.slice(0, 3).map((u) => u.id),
  );

  const universities = useMemo(
    () =>
      selectedIds
        .map((id) => allUniversities.find((u) => u.id === id)!)
        .filter(Boolean),
    [selectedIds, allUniversities],
  );

  const visibleFeatures = useMemo(() => {
    return FEATURES.filter((feature) => {
      const values = universities.map((u) => getValue(u, feature.key));
      return values.some((v) => v !== "N/A");
    });
  }, [universities]);

  const handleSelect = (slot: number, id: number) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[slot] = id;
      return next;
    });
  };

  return (
    <section id="compare" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Compare Universities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare top medical universities side-by-side to find the right fit
            for you.
          </p>
        </div>

        {/* University Selectors */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((slot) => (
            <div key={slot}>
              <label className="block text-sm font-semibold text-[#202124] mb-1">
                University {slot + 1}
              </label>
              <select
                value={selectedIds[slot] ?? ""}
                onChange={(e) => handleSelect(slot, Number(e.target.value))}
                className="w-full border border-[#D9E3DC] rounded-xl px-3 py-2 text-sm text-[#202124] bg-white focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                suppressHydrationWarning={true}
              >
                {allUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#D9E3DC] overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#123B2A] text-white">
                  <th className="text-left p-4 font-semibold w-40 text-sm">Features</th>
                  {universities.map((u, idx) => (
                    <th
                      key={`${u.id}-${idx}`}
                      className="text-center p-4 font-semibold min-w-48"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-[#D9E3DC] shadow-sm">
                          {u.thumbnailPath ? (
                            <Image
                              src={cdn(u.thumbnailPath)}
                              alt={u.name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#E6EEE8] flex items-center justify-center text-[#00843D] font-bold text-lg">
                              {u.name[0]}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold leading-tight text-white">
                          {u.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleFeatures.map((feature, idx) => (
                  <tr
                    key={feature.key}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#F4F7F5]"}
                  >
                    <td className="p-3 font-semibold text-[#202124] text-sm whitespace-nowrap border-b border-[#D9E3DC]/40">
                      {feature.label}
                    </td>
                    {universities.map((u, idx) => {
                      const val = getValue(u, feature.key);
                      const isGood = val !== "N/A";
                      const isRecognition = feature.key === "recognition";
                      return (
                        <td
                          key={`${u.id}-${idx}`}
                          className="p-3 text-center text-[#343A40] text-sm border-b border-[#D9E3DC]/40"
                        >
                          {isRecognition && isGood ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {val.split(", ").map((r) => (
                                <span
                                  key={r}
                                  className="text-xs bg-[#E6EEE8] text-[#00843D] font-semibold px-2.5 py-0.5 rounded-full"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              className={
                                !isGood
                                  ? "text-gray-400"
                                  : feature.key === "fee"
                                    ? "text-[#00843D] font-bold"
                                    : "text-[#202124]"
                              }
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* CTA row */}
                <tr className="bg-[#E6EEE8]/50">
                  <td className="p-4 font-semibold text-[#202124] text-sm">
                    View Details
                  </td>
                  {universities.map((u, idx) => (
                    <td key={`${u.id}-${idx}`} className="p-4 text-center">
                      <Link
                        href={`/universities/${u.slug}`}
                        className="inline-block bg-[#00843D] hover:bg-[#006830] text-white text-xs px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm"
                      >
                        View University →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/compare"
            className="inline-block bg-white text-[#00843D] border-2 border-[#00843D] hover:bg-[#00843D] hover:text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
          >
            Compare All Universities →
          </Link>
        </div>
      </div>
    </section>
  );
}
