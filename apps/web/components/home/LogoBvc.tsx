import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dictionary } from "../../lib/lang";

const LogoBvc = () => {
  return (
    <Link href="#" className="flex items-center justify-center gap-1">
      <Image
        src={"/logo.png"}
        alt={dictionary.en.config.site_name}
        width={60}
        height={60}
      />
      <div className="leading-tight">
        <div className="text-2xl font-bold tracking-wider text-[#0f5e78] hidden md:block">
          {dictionary.en.config.site_name}
        </div>
        <div className="text-xl font-bold tracking-wider text-[#0f5e78]  md:hidden">
          {dictionary.en.config.site_short_name}
        </div>
        <div className="text-md font-stretch-50% text-slate-900 hidden md:block">
          {dictionary.en.config.site_slogan}
        </div>
        <div className="text-md font-stretch-50% text-slate-900  md:hidden">
          {dictionary.en.config.site_short_slogan}
        </div>
      </div>
    </Link>
  );
};

export default LogoBvc;
