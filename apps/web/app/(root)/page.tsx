import ActivityVideoSlider from "components/home/ActivityVideoSlider";
import AboutVideoSection from "../../components/home/AboutVideoSection";
import HomeFAQsSection from "../../components/home/HomeFAQsSection";
import HomeHero from "../../components/home/HomeHero";
import ProgrammesCarousel from "../../components/home/ProgrammesCarousel";
import TestimoniesReel from "../../components/home/TestimoniesReel";
import "./page.module.css";

export default function Page() {
    return (
        <>
            <HomeHero />
            <AboutVideoSection />
            <ProgrammesCarousel />
            <TestimoniesReel />
            <ActivityVideoSlider />
            <HomeFAQsSection />
        </>
    );
}
