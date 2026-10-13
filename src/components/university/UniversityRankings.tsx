import { Globe, CheckCircle, Shield, Star, Trophy } from "lucide-react";

interface Ranking {
  id: number;
  rankingBody: string;
  rank: string | null;
  category: string | null;
  year: string | null;
}
interface Props {
  rankings: Ranking[];
}

export default function UniversityRankings({ rankings }: Props) {
  if (rankings.length === 0) return null;
  const accreditations = [
    {
      icon: Globe,
      title: "WHO Listed",
      href: "https://www.who.int/",
      desc: "Listed in World Health Organization Directory",
      status: "Verified",
    },
    {
      icon: CheckCircle,
      title: "Internationally Accredited",
      desc: "Approved by international medical councils for global practice",
      status: "Approved",
    },
    {
      icon: Shield,
      title: "Ministry Recognition",
      desc: "Recognized by Ministry of Education, UAE",
      status: "Licensed",
    },
    {
      icon: Star,
      title: "International Standards",
      desc: "Meets global medical education standards (FAIMER, WFME)",
      status: "Certified",
    },
  ];

  return (
    <section id="rankings" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#202124] mb-4">
            Rankings &amp; Accreditation
          </h2>
          <p className="text-xl text-[#343A40] max-w-3xl mx-auto">
            Our commitment to excellence is reflected in our international
            rankings and comprehensive accreditations.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-[#202124] mb-8">
              Official Accreditations
            </h3>
            <div className="space-y-6">
              {accreditations.map((accred) => (
                <div
                  key={accred.title}
                  className="bg-[#F4F7F5] p-6 rounded-xl border border-[#D9E3DC] border-l-4 border-l-[#00843D] hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#E6EEE8] p-3 rounded-lg shrink-0">
                      <accred.icon className="h-6 w-6 text-[#00843D]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-[#202124]">
                          {accred.href ? (
                            <a
                              href={accred.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#00843D] hover:underline transition-colors"
                            >
                              {accred.title}
                            </a>
                          ) : (
                            accred.title
                          )}
                        </h4>
                        <span className="bg-[#E6EEE8] text-[#00843D] px-3 py-1 rounded-full text-sm font-semibold border border-[#00843D]/20">
                          {accred.status}
                        </span>
                      </div>
                      <p className="text-[#343A40]">{accred.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {rankings.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold text-[#202124] mb-8">
                Global Rankings
              </h3>
              <div className="bg-[#F4F7F5] border border-[#D9E3DC] p-8 rounded-2xl min-h-[200px]">
                <div className="space-y-4">
                  {rankings.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-[#D9E3DC] transition-shadow duration-200"
                    >
                      <div>
                        <h4 className="font-semibold text-[#202124]">
                          {r.rankingBody}
                        </h4>
                        {r.category && (
                          <p className="text-sm text-[#343A40]">{r.category}</p>
                        )}
                        {r.year && (
                          <p className="text-xs text-[#343A40] mt-0.5">
                            {r.year}
                          </p>
                        )}
                      </div>
                      {r.rank && (
                        <span className="text-2xl font-bold text-[#00843D]">
                          #{r.rank}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
