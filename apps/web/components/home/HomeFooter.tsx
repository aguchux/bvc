import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dictionary } from "../../lib/lang";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      "Home",
      "About Us",
      "Programmes",
      "Admissions",
      "FAQs",
      "Contact Us",
    ],
  },
  {
    title: "Admissions",
    links: [
      "Admissions",
      "Tuition",
      "Scholarship",
      "Apply",
      "Digital Learning",
      "E-Library",
    ],
  },
  {
    title: "Programmes",
    links: [
      "Business Administration (MBA)",
      "Public Administration (MPA)",
      "Information Technology (MIT)",
      "Public Health (MPH)",
      "Relevant Short Courses",
    ],
  },
];

const social = [
  { label: "Facebook", icon: "F" },
  { label: "Twitter", icon: "T" },
  { label: "Instagram", icon: "I" },
  { label: "LinkedIn", icon: "in" },
  { label: "TikTok", icon: "t" },
  { label: "YouTube", icon: "▶" },
];

const HomeFooter = () => {
  return (
    <footer className="bg-[#0F5E78] text-white">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ImagePlaceholder />
            <div className="flex flex-col">
              <span className="font-bold text-xl">
                {dictionary.en.config.site_name}
              </span>
              <span className="font-light">
                {dictionary.en.config.site_slogan}
              </span>
            </div>
          </div>
          <p className="text-base text-white/70">
            {dictionary.en.config.site_footer_text}
          </p>
          <div className="space-y-2 text-base text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-[#1bd741]">🟢</span>
              {dictionary.en.contact.phone}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1bd741]">📞</span>
              {dictionary.en.contact.phone_secondary}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1bd741]">✉️</span>
              {dictionary.en.contact.email_help}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-bold">{section.title}</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#0a4a5b] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()}. {dictionary.en.config.site_name}. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <Link href="#" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {social.map((item) => (
              <Link
                key={item.label}
                href="#"
                aria-label={item.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs transition hover:border-white hover:text-white"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const ImagePlaceholder = () => (
  <Image
    src="/logo-dark.png"
    alt={dictionary.en.config.site_name}
    width={60}
    height={60}
    priority
  />
);

export default HomeFooter;
