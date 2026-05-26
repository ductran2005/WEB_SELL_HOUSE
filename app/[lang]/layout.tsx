import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "@/app/globals.css";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-noto-serif",
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: "vi" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.seoTitle || "Riverfront Residences",
    description: dict.seoDescription || "Trải nghiệm căn hộ 360 ven sông Sài Gòn",
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${beVietnam.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#080807] text-white">
        {children}
      </body>
    </html>
  );
}
