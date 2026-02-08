import Link from "next/link";
import React from "react";
import { Icon } from "../../constants/home";

const SmartApply = () => {
  return (
    <aside className="pointer-events-auto self-center lg:justify-self-end">
      <div className="w-full max-w-md rounded-2xl bg-[#0f5e78] p-6 text-white shadow-xl">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ffcd4a]" />
          <h2 className="text-xl font-bold">Available Courses</h2>
        </div>

        <div className="mt-0 space-y-5">{/* Application */}</div>
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          href="#"
          className="inline-flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-[#0f5e78] px-6 py-4 text-base font-bold text-white shadow-lg hover:opacity-95"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Icon name="calendar" />
          </span>
          Admission Calendar <Icon name="arrow" />
        </Link>
      </div>
    </aside>
  );
};

export default SmartApply;
