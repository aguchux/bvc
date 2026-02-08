import React from "react";
import { dictionary } from "../../lib/lang";

const HeroBandBanner = () => {
  return (
    <section className="flex items-center justify-center bg-[#0F5E78] px-4 py-4 text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-4">
        <p className="text-center text-sm font-semibold uppercase tracking-tight md:text-base">
          {dictionary.en.config.licensed_by_nuc}
        </p>
      </div>
    </section>
  );
};

export default HeroBandBanner;
