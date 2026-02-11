"use client";

import type { ReactNode } from "react";
import Sidebar from "components/dashboard/Sidebar";
import Topbar from "components/dashboard/Topbar";

const layoutPadding = "px-4 py-5 lg:px-8";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-350">
        <main className={`flex-1 ${layoutPadding}`}>
          <Topbar />
          <div className="mt-5">{children}</div>
        </main>
      </div>
      <div className="h-6 lg:hidden" />
    </>
  );
}
