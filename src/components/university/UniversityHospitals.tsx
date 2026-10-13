import { Stethoscope, MapPin, Home, CheckCircle } from "lucide-react";

interface Hospital {
  id: number;
  hospital: {
    name: string;
    city: string | null;
    beds: number | null;
    accreditation: string | null;
  };
}
interface Props {
  hospitals: Hospital[];
}

export default function UniversityHospitals({ hospitals }: Props) {
  if (hospitals.length === 0) return null;

  return (
    <section className="py-10 bg-[#F4F7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <span className="inline-block bg-[#E6EEE8] text-[#00843D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-[#00843D]/20">
            Clinical Training
          </span>
          <h2 className="text-4xl font-bold text-[#202124]">
            Affiliated Hospitals
          </h2>
          <p className="text-base text-[#343A40] mt-2">
            World-class clinical training at top hospitals
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((uh) => (
            <div
              key={uh.id}
              className="bg-white border border-[#D9E3DC] border-t-4 border-t-[#00843D] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#E6EEE8] p-2.5 rounded-xl shadow-sm shrink-0 border border-[#D9E3DC]">
                  <Stethoscope className="w-5 h-5 text-[#00843D]" />
                </div>
                <h3 className="font-bold text-[#202124] text-base leading-snug pt-0.5">
                  {uh.hospital.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {uh.hospital.city && (
                  <span className="flex items-center gap-1 bg-[#F4F7F5] border border-[#D9E3DC] text-[#343A40] rounded-lg px-2.5 py-1">
                    <MapPin className="w-3 h-3 text-[#C8102E]" />
                    {uh.hospital.city}
                  </span>
                )}
                {uh.hospital.beds && (
                  <span className="flex items-center gap-1 bg-[#F4F7F5] border border-[#D9E3DC] text-[#343A40] rounded-lg px-2.5 py-1">
                    <Home className="w-3 h-3 text-[#00843D]" />
                    {uh.hospital.beds} beds
                  </span>
                )}
                {uh.hospital.accreditation && (
                  <span className="flex items-center gap-1 bg-[#E6EEE8] border border-[#00843D]/20 text-[#00843D] rounded-lg px-2.5 py-1 font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    {uh.hospital.accreditation}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
