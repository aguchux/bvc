import EnrolledCoursesSection from "components/courses/EnrolledCoursesSection";

export const metadata = {
    title: "Dashboard Courses",
    description:
        "View and access your enrolled courses from the LMS directly on your dashboard.",
};
export default function Page() {
    return <EnrolledCoursesSection />
}
