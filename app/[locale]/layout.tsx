import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Onest } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../globals.css";
import { Analytics } from "@/components/Analytics";
import { SelectionClearButton } from "@/components/SelectionClearButton";
import { SubscribePopup } from "@/components/SubscribePopup";
import { dictionary, getLocale, locales, type Locale } from "@/lib/i18n";
import { themeInitScript } from "@/lib/theme";

// Onest: a modern grotesque with full Cyrillic + Latin, so ru and uz pages
// share one typeface. JetBrains Mono carries labels, dates and scores.
const sans = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap"
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap"
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const t = dictionary[locale];

  return {
    metadataBase: new URL("https://blog.aisolution.uz"),
    title: {
      default: t.metaTitle,
      template: "%s — AI Solution Blog"
    },
    description: t.metaDescription,
    keywords: ["aisolution", "ai solution", "анализ технологического рынка", "обзоры нейросетей", "обзоры программ", "ai стартапы узбекистан", "texnologiya bozori tahlili", "dasturlar sharhi", "внедрение ии в бизнес", "ии в узбекистане", "ai bozori oʻzbekiston", "оценка стартапов"],
    alternates: {
      types: { "application/rss+xml": `/${locale}/feed.xml` }
    },
    // Raster icons first: Google Search needs a crawlable PNG/ICO, size a multiple of 48px.
    icons: {
      icon: [
        { url: "/brand/favicon-192.png?v=7", sizes: "192x192", type: "image/png" },
        { url: "/brand/favicon-96.png?v=7", sizes: "96x96", type: "image/png" },
        { url: "/brand/favicon-48.png?v=7", sizes: "48x48", type: "image/png" },
        { url: "/favicon.ico?v=7", sizes: "48x48" }
      ],
      shortcut: "/favicon.ico?v=7",
      apple: { url: "/brand/apple-touch-icon.png?v=7", sizes: "180x180", type: "image/png" }
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: `https://blog.aisolution.uz/${locale}`,
      siteName: "AI Solution Blog",
      images: ["/og-image.png?v=2"],
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "uz_UZ"
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
      images: ["/og-image.png?v=2"]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

/**
 * This is the app's ROOT layout (it owns <html>/<body>) even though it
 * lives under [locale] — the bare "/" route is handled by middleware.ts
 * (308 to /ru) rather than by an app/page.tsx, so nothing needs a root
 * layout outside this dynamic segment. That's what lets <html lang> vary
 * per locale instead of being hardcoded — see claude.md, задача 4.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = getLocale(rawLocale);
  const t = dictionary[locale];

  return (
    // suppressHydrationWarning: themeInitScript sets data-theme on <html>
    // before React hydrates, so that one attribute legitimately differs.
    <html lang={locale} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        {/* Advertising contact, right above the footer on every page. */}
        <section className="ad-contact" aria-labelledby="ad-contact-title">
          <div>
            <h2 id="ad-contact-title">{t.adTitle}</h2>
            <p>{t.adCopy}</p>
          </div>
          <div className="ad-contact-links">
            <a href="https://t.me/Abdujabborovmurod" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 4.5 2.9 11.4c-.9.4-.9 1.6.1 1.9l4.5 1.4 1.7 5.3c.2.7 1.1.9 1.6.4l2.5-2.3 4.6 3.4c.6.4 1.4.1 1.6-.6L22.2 5.6c.2-.8-.5-1.4-1.2-1.1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              @Abdujabborovmurod
            </a>
            <a href="tel:+998887450522">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              +998 88 745 05 22
            </a>
          </div>
        </section>
        <footer className="site-footer">
          <div className="footer-brand">
            <span className="footer-mark">
              <img className="brand-logo-dark" src="/brand/mark-on-dark.png" alt="" width={28} height={28} />
              <img className="brand-logo-light" src="/brand/mark-on-light.png" alt="" width={28} height={28} />
            </span>
            <div>
              <strong>AI Solution Blog</strong>
              <small>{t.footerTagline}</small>
            </div>
          </div>
          <Link className="footer-link" href="https://aisolution.uz">
            aisolution.uz <span aria-hidden="true">→</span>
          </Link>
        </footer>
        <SelectionClearButton locale={locale} />
        <SubscribePopup locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
