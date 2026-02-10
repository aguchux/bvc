"use client";

import Image from "next/image";
import React, { useState } from "react";
import { dictionary } from "../../lib/lang";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: { title: string; items: FAQItem[] }[] = [
  {
    title: "ADMISSIONS",
    items: [
      {
        question: "Am I required to take JAMB/UTME?",
        answer:
          "Depending on the programme, UTME is optional for some pathways. Submit your credentials to admissions for course-specific requirements.",
      },
      {
        question: "Are BVC graduates eligible for NYSC?",
        answer:
          "Yes, graduates from accredited Bonny Vocational Center programmes qualify for NYSC once they complete their requirements.",
      },
      {
        question: "What are the requirements to study at Bonny Vocational Center?",
        answer:
          "Typically, you need a secondary school certificate or equivalent plus any specific course prerequisites.",
      },
      {
        question:
          "What is the duration of a bachelor’s degree programme at Bonny Vocational Center?",
        answer:
          "Most bachelor’s degrees range from three to five years depending on your pace (full-time/part-time).",
      },
      {
        question: "Are open universities better than traditional universities?",
        answer:
          "They are a different modality focused on flexibility and accessibility without sacrificing academic standards.",
      },
      {
        question: "How much is Bonny Vocational Center’s tuition fee?",
        answer:
          "Tuition varies by programme. Check the programme page or contact admissions for current fees and payment plans.",
      },
    ],
  },
  {
    title: "TRAINING",
    items: [
      {
        question: "Can I study multiple programmes at once?",
        answer:
          "Yes — we encourage planning with an advisor so you can balance your course load effectively.",
      },
      {
        question: "Are industry practicums available?",
        answer:
          "Certain programmes include practicums or internships. Review the programme outline for details.",
      },
      {
        question: "How do I access learning materials?",
        answer:
          "All materials are hosted on our LMS. You receive secure access after enrolment.",
      },
      {
        question: "What support is available for remote learners?",
        answer:
          "Learners have access to academic coaching, dedicated advisors, and peer discussion forums.",
      },
      {
        question: "Is there financial aid for training?",
        answer:
          "We publish scholarships and subsidized financing options every term — check our admissions page.",
      },
      {
        question: "Do classes run every week?",
        answer:
          "Live sessions follow the academic calendar, and recordings stay available when you cannot attend.",
      },
    ],
  },
  {
    title: "TUITION & FEES",
    items: [
      {
        question: "Are there scholarships available?",
        answer:
          "Yes. Limited scholarships are awarded each term. Keep an eye on announcements for how to apply.",
      },
      {
        question: "What is the payment plan for tuition fees?",
        answer:
          "Most students split tuition into instalments. Your programme advisor will share the exact schedule.",
      },
      {
        question: "Can I get a refund if I withdraw?",
        answer:
          "Refund eligibility depends on the withdrawal date. Please review our terms for the applicable refund window.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "Mandatory fees are listed upfront; optional services such as proctored exams may incur extra charges.",
      },
      {
        question: "How do I apply for financial aid?",
        answer:
          "Complete the financial aid request form via your portal and our team will assess your eligibility within seven business days.",
      },
    ],
  },
];

const HomeFAQsSection = () => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenQuestion((prev) => (prev === key ? null : key));
  };
  return (
    <section className="bg-slate-200 py-5">
      <div className="mx-auto max-w-7xl  px-0 sm:px-6">
        <div className="grid gap-10 grid-cols-4 px-8 py-2 rounded-2xl">
          <div className="space-y-3 ">
            <p className="text-lg font-bold text-[#0F5E78]">
              Frequently Asked Questions
            </p>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/sliders/3.jpg"
                alt="support team"
                width={600}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0">
              <h2 className="text-3xl font-bold text-slate-900">
                Questions other students are asking
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Get in touch with an application specialist to get more
                information about the Bonny Vocational Center application process.
              </p>
              <div className="text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-[#1bd741] text-lg">✉️</span>
                  <span className="font-semibold text-slate-900">
                    {dictionary.en.contact.email_help}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 grid grid-cols-3 col-span-3 md:grid-cols-3">
            {faqData.map((column) => (
              <div key={column.title} className="p-2">
                <h3 className="mb-6 text-lg font-bold tracking-[0.15em] text-slate-800">
                  {column.title}
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                  {column.items.map((item, index) => {
                    const key = `${column.title}-${index}`;
                    const isOpen = openQuestion === key;
                    return (
                      <div key={key} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="flex cursor-pointer w-full items-center justify-between text-left text-sm text-slate-700 transition hover:text-slate-900"
                        >
                          <span>{item.question}</span>
                          <span className="text-slate-400">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="text-xs text-slate-800 font-semibold p-2 border border-slate-200 rounded-lg bg-slate-100">
                            {item.answer}
                          </p>
                        )}
                        <div className="border-b border-slate-100 last:border-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQsSection;
