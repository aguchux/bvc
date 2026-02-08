import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export const metadata = {
  title: "State of Training (SOT) — Bonny Vocational Center",
  description: "BVC State of Training report and overview.",
};

function mdToHtml(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let out = "";
  let inList = false;
  for (const line of lines) {
    if (!line.trim()) {
      if (inList) {
        out += "</ul>";
        inList = false;
      }
      out += "<p></p>";
      continue;
    }
    if (line.startsWith("### ")) {
      out += `<h3>${line.slice(4)}</h3>`;
      continue;
    }
    if (line.startsWith("## ")) {
      out += `<h2>${line.slice(3)}</h2>`;
      continue;
    }
    if (line.startsWith("# ")) {
      out += `<h1>${line.slice(2)}</h1>`;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        out += "<ul>";
        inList = true;
      }
      out += `<li>${line.replace(/^\s*[-*]\s+/, "")}</li>`;
      continue;
    }
    const htmlLine = line.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, t, u) => `<a href="${u}">${t}</a>`,
    );
    out += `<p>${htmlLine}</p>`;
  }
  if (inList) out += "</ul>";
  return out;
}

export default async function SotPage() {
  const mdPath = path.join(process.cwd(), "contents.md");
  let html = "";
  try {
    const md = await fs.readFile(mdPath, "utf8");
    html = mdToHtml(md);
  } catch {
    html = `<h1>State of Training (SOT)</h1><p>Content not found. Add <code>contents.md</code> to populate this page.</p><p><a href="/contact" class="underline">Contact</a></p>`;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 prose">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-8">
        <Link
          href="/contact"
          className="rounded bg-[#0f5e78] px-4 py-2 text-white"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
