"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { homepageFaqs } from "@/lib/homepage-faqs";

interface HomepageFAQProps {
  dynamicFaqs?: Array<{ question: string; answer: string }>;
}

export default function HomepageFAQ({ dynamicFaqs }: HomepageFAQProps) {
  const displayFaqs =
    dynamicFaqs && dynamicFaqs.length > 0 ? dynamicFaqs : homepageFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white border-t border-[#D9E3DC]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-[#E6EEE8] p-3 rounded-full">
              <HelpCircle className="w-8 h-8 text-[#00843D]" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#202124] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#343A40]">
            Everything you need to know about studying MBBS in UAE as an
            Indian student.
          </p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-[#00843D] shadow-md bg-white ring-1 ring-[#00843D]/20" : "border-[#D9E3DC] bg-[#F4F7F5]"}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-lg ${isOpen ? "text-[#00843D]" : "text-[#202124]"}`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#00843D]" : "text-[#343A40]"}`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-[#343A40] leading-relaxed border-t border-[#D9E3DC] pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
