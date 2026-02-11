import TopLinksSlimBar from "../../components/home/TopLinksSlimBar";
import { NavigationMenu } from "../../components/home/NavigationMenu";
import HomeFooter from "../../components/home/HomeFooter";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-full bg-[#f7f6f3]">
            <main className="relative">
                <TopLinksSlimBar />
                <NavigationMenu />
                {children}
                <HomeFooter />
            </main>
        </div>
    );
}
