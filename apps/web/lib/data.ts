export type Stat = {
  label: string;
  value: string;
  subLabel?: string;
  delta?: string; // e.g. "0% vs last session"
  tone?: "default" | "danger" | "navy";
};

export type Course = {
  code: string;
  title: string;
  units: number;
  badgeTop?: string; // "MIT"
  status?: "Enrolled" | "Pending";
  category?: "CORE" | "ELECTIVE";
  imageUrl: string;
};

export type Txn = {
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
};

export const stats: Stat[] = [
  {
    label: "Last Grade Point Average",
    value: "0.00",
    delta: "0% vs last session",
    tone: "default",
  },
  {
    label: "Completed Course Units",
    value: "0",
    subLabel: "0 units",
    tone: "default",
  },
  {
    label: "Cumulative Grade Point Average",
    value: "0.00",
    delta: "0% vs last session",
    tone: "navy",
  },
];

export const courses: Course[] = [
  {
    code: "MIT 8103",
    title: "Advanced Database Systems",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
  },
  {
    code: "MIT 8113",
    title: "Digital Transformation and Innovation",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=70",
  },
  {
    code: "MIT 8111",
    title: "Ethics and Legal Issues in IT",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70",
  },
  {
    code: "MIT 8101",
    title: "Information Technology Management",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
  },
  {
    code: "MIT 8105",
    title: "Network Architecture and Protocols",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    code: "MIT 8107",
    title: "Software Development Lifecycle",
    units: 3,
    badgeTop: "MIT",
    status: "Enrolled",
    category: "CORE",
    imageUrl:
      "https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&q=70",
  },
];

export const transactions: Txn[] = [
  {
    date: "13 Oct 2025",
    description: "Installment 1",
    amount: "₦***,***",
    status: "Paid",
  },
];
