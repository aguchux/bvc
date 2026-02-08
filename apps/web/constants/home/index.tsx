export type MenuType = "list" | "grid" | "mega";
export type NavLinkMenuType = {
  label: string;
  href: string;
  bannerImage?: string;
  description?: string;
  menuType?: MenuType;
  subMenus?: NavLinkMenuType[];
};
export const navLinks: NavLinkMenuType[] = [
  {
    label: "Home",
    href: "",
  },
  {
    label: "About BVC",
    href: "#",
    menuType: "list",
    subMenus: [
      { label: "Our History", href: "#" },
      { label: "Mission & Vision", href: "#" },
    ],
  },
  {
    label: "Faculties",
    href: "#",
    menuType: "list",
    subMenus: [
      { label: "Faculty of Arts", href: "#" },
      { label: "Faculty of Science", href: "#" },
      { label: "Faculty of Business", href: "#" },
    ],
  },
  {
    label: "Courses",
    href: "#",
    menuType: "mega",
    subMenus: [
      {
        label: "Undergraduate Programs",
        description:
          "Explore our diverse undergraduate courses designed to empower your future.",
        href: "#",
      },
      {
        label: "Graduate Programs",
        description:
          "Advance your career with our specialized graduate degrees and research opportunities.",
        href: "#",
      },
      {
        label: "Online Learning",
        description:
          "Flexible online courses to fit your schedule and learning style.",
        href: "#",
      },
      {
        label: "Continuing Education",
        description:
          "Lifelong learning opportunities for personal and professional growth.",
        href: "#",
      },
    ],
  },
  {
    label: "Admission",
    href: "#",
    menuType: "list",
    subMenus: [
      { label: "Undergraduate Admission", href: "#" },
      { label: "Graduate Admission", href: "#" },
    ],
  },
  {
    label: "Tuition & Fees",
    href: "#",
    menuType: "list",
    subMenus: [
      { label: "Undergraduate Fees", href: "#" },
      { label: "Graduate Fees", href: "#" },
    ],
  },
  {
    label: "Campus Life",
    href: "#",
    menuType: "grid",
    subMenus: [
      {
        label: "Residential Living",
        description:
          "Experience vibrant, safe communities with 24/7 support and modern amenities.",
        href: "#residential",
        bannerImage: "/sliders/1.jpg",
      },
      {
        label: "Student Support",
        description:
          "Advising, counseling, and wellness programs that keep you balanced through every term.",
        href: "#support",
        bannerImage: "/sliders/2.jpg",
      },
      {
        label: "Clubs & Activities",
        description:
          "Join hundreds of student groups, cultural events, and service projects across campus.",
        href: "#activities",
        bannerImage: "/sliders/3.jpg",
      },
    ],
  },
  { label: "Contact", href: "#" },
];

export const slides = [
  {
    id: 1,
    title: "Empowering Minds, Inspiring Futures",
    image: "/sliders/1.jpg",
    buttonText: "Discover Our Programs",
    href: "#programs",
  },
  {
    id: 2,
    title: "Achieve Your Dreams with Confidence",
    image: "/sliders/2.jpg",
    buttonText: "Join Now",
    href: "#apply",
  },
  {
    id: 3,
    title: "Shape Your Future with Us Today",
    image: "/sliders/3.jpg",
    buttonText: "Learn More",
    href: "#learn",
  },
];

export const notices = [
  {
    title: "New digital resources available",
    date: "December 1, 2025",
    code: "UBD/REG/MED/0002/IKJFJ/03",
  },
];

export function Icon({
  name,
}: {
  name: "cap" | "search" | "menu" | "arrow" | "file" | "calendar";
}) {
  const common = "inline-block align-middle";
  switch (name) {
    case "cap":
      return (
        <svg
          className={common}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 8.5L12 4l9 4.5-9 4.5L3 8.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M7 10.7V15c0 1.1 2.2 3 5 3s5-1.9 5-3v-4.3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M21 9v6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "search":
      return (
        <svg
          className={common}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M16.3 16.3 21 21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "menu":
      return (
        <svg
          className={common}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 7h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4 12h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4 17h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "arrow":
      return (
        <svg
          className={common}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9 18 15 12 9 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "file":
      return (
        <svg
          className={common}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M14 2v6h6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg
          className={common}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 3v3M17 3v3M4 8h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
