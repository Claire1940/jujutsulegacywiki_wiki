"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Dices,
  ExternalLink,
  Gem,
  GraduationCap,
  Link2,
  Map as MapIcon,
  Sparkles,
  Swords,
  Ticket,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Shared module header with a unique icon per module
function ModuleHeader({
  icon,
  title,
  intro,
  linkData,
  locale,
}: {
  icon: React.ReactNode;
  title: string;
  intro: string;
  linkData: { url: string; title: string } | null | undefined;
  locale: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-5">
        {icon}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        <LinkedTitle linkData={linkData} locale={locale}>
          {title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid 卡片顺序与下方 section id 一一对应
const TOOLS_SECTION_IDS = [
  "codes",
  "official-links",
  "beginner-guide",
  "technique-tier-list",
  "spins-rerolls",
  "vessels-builds",
  "leveling-route",
  "raids-drops",
];

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.jujutsulegacywiki.wiki";

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [routeExpanded, setRouteExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      // clipboard unavailable — non-fatal
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1500);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Jujutsu Legacy Wiki",
        description:
          "Complete Jujutsu Legacy Wiki covering codes, cursed techniques, vessels, clans, bosses, raids, and tier lists for the Roblox anime fighting game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Jujutsu Legacy - Roblox Anime RPG Fighting",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Jujutsu Legacy Wiki",
        alternateName: "Jujutsu Legacy",
        url: siteUrl,
        description:
          "Complete Jujutsu Legacy Wiki resource hub for codes, techniques, vessels, clans, bosses, raids, and tier lists",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Jujutsu Legacy Wiki - Roblox Anime RPG Fighting",
        },
        sameAs: [
          "https://www.roblox.com/games/15694107053/Jujutsu-Legacy",
          "https://discord.com/invite/jujutsu-legacy-beta-1247159977181708288",
          "https://www.roblox.com/communities/33596404/jujutsu-legacy-official",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Jujutsu Legacy",
        gamePlatform: ["PC", "Mac", "Mobile"],
        applicationCategory: "Game",
        genre: ["Fighting", "RPG", "Anime", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 20,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/15694107053/Jujutsu-Legacy",
        },
      },
      {
        "@type": "VideoObject",
        name: "JUJUTSU LEGACY TECHNIQUES TIER LIST! ROBLOX",
        description:
          "Jujutsu Legacy technique tier list video covering the best cursed techniques for the Roblox anime fighting game.",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/dT9KSB0gaKg",
        url: "https://www.youtube.com/watch?v=dT9KSB0gaKg",
      },
    ],
  };

  const codes = t.modules.codes;
  const officialLinks = t.modules.officialLinks;
  const beginnerGuide = t.modules.beginnerGuide;
  const techniqueTierList = t.modules.techniqueTierList;
  const spins = t.modules.spinsClanAndRaceRerolls;
  const vessels = t.modules.vesselsAndBuilds;
  const levelingRoute = t.modules.questsBossesAndLevelingRoute;
  const raids = t.modules.raidsDropsSwordsAndAccessories;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://discord.com/invite/jujutsu-legacy-beta-1247159977181708288"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.roblox.com/games/15694107053/Jujutsu-Legacy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="dT9KSB0gaKg"
              title="JUJUTSU LEGACY TECHNIQUES TIER LIST! ROBLOX"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Ticket className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={codes.title}
            intro={codes.intro}
            linkData={moduleLinkMap["codes"]}
            locale={locale}
          />

          {/* Active Codes */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
            {codes.activeCodes.map((c: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {codes.activeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(c.code)}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-border hover:bg-white/10 transition-colors"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        {codes.copyLabel}
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono font-bold text-base md:text-lg mb-2 break-all">
                  {c.code}
                </p>
                <p className="text-sm text-muted-foreground">{c.reward}</p>
                <p className="text-xs text-muted-foreground mt-2">{c.requirement}</p>
              </div>
            ))}
          </div>

          {/* Expired Code Groups */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {codes.expiredGroups.map((group: any, gi: number) => (
              <div
                key={gi}
                className="p-4 md:p-5 bg-white/[0.02] border border-border rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
                    {codes.expiredLabel}
                  </span>
                  <h3 className="font-semibold text-sm md:text-base">{group.label}</h3>
                </div>
                <p className="font-mono text-xs md:text-sm text-muted-foreground mb-2 break-words">
                  {group.codes}
                </p>
                <p className="text-xs text-muted-foreground">{group.note}</p>
              </div>
            ))}
          </div>

          {/* Redeem Guide */}
          <div className="scroll-reveal p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">{codes.redeemTitle}</h3>
            </div>
            <ol className="space-y-2">
              {codes.redeemSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Official Links */}
      <section id="official-links" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Link2 className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={officialLinks.title}
            intro={officialLinks.intro}
            linkData={moduleLinkMap["officialLinks"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialLinks.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {link.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--nav-theme-light))] transition-colors" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">{link.label}</h3>
                <p className="text-sm text-muted-foreground">{link.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={beginnerGuide.title}
            intro={beginnerGuide.intro}
            linkData={moduleLinkMap["beginnerGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-5 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 md:flex-shrink-0">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="text-xs md:text-sm text-[hsl(var(--nav-theme-light))]">
                    {step.goal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Technique Tier List */}
      <section id="technique-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Trophy className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={techniqueTierList.title}
            intro={techniqueTierList.intro}
            linkData={moduleLinkMap["techniqueTierList"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-4 md:space-y-5">
            {techniqueTierList.tiers.map((tier: any, ti: number) => {
              const tierColor =
                tier.tier === "S"
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : tier.tier === "A"
                    ? "text-sky-400 border-sky-500/30 bg-sky-500/10"
                    : tier.tier === "B"
                      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                      : "text-slate-400 border-slate-500/30 bg-slate-500/10";
              return (
                <div
                  key={ti}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg border font-bold text-lg md:text-xl ${tierColor}`}
                    >
                      {tier.tier}
                    </span>
                    <div>
                      <h3 className="font-bold text-base md:text-lg">{tier.label}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{tier.summary}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tier.techniques.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm"
                      >
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块中段 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Spins, Clan and Race Rerolls */}
      <section id="spins-rerolls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Dices className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={spins.title}
            intro={spins.intro}
            linkData={moduleLinkMap["spinsClanAndRaceRerolls"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-4">
            {spins.rows.map((row: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                  <div className="md:w-52 md:flex-shrink-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <DynamicIcon name={row.icon} className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">
                        {row.type}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{row.affects}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{spins.bestForLabel}: </span>
                      {row.bestFor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{spins.planLabel}: </span>
                      {row.plan}
                    </p>
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                      <p className="text-xs text-amber-200/90">
                        <span className="font-semibold">{spins.avoidLabel}: </span>
                        {row.avoid}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Vessels and Builds */}
      <section id="vessels-builds" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Swords className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={vessels.title}
            intro={vessels.intro}
            linkData={moduleLinkMap["vesselsAndBuilds"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vessels.vessels.map((v: any, index: number) => (
              <div
                key={index}
                className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <DynamicIcon name={v.icon} className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </span>
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{v.name}</h3>
                </div>
                <span className="inline-flex self-start text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-3">
                  {v.role}
                </span>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-foreground mb-1.5">{vessels.techniquesLabel}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.techniques.map((tech: string, ti: number) => (
                      <span key={ti} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-border text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">{vessels.focusLabel}: </span>
                  {v.focus}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">{vessels.progressionLabel}: </span>
                  {v.progression}
                </p>
                <p className="text-xs text-[hsl(var(--nav-theme-light))] border-t border-border pt-3 mt-auto">
                  <span className="font-semibold">{vessels.tipLabel}: </span>
                  {v.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Quests, Bosses, and Leveling Route */}
      <section id="leveling-route" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<MapIcon className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={levelingRoute.title}
            intro={levelingRoute.intro}
            linkData={moduleLinkMap["questsBossesAndLevelingRoute"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-2">
            {levelingRoute.bands.map((band: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setRouteExpanded(routeExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <DynamicIcon name={band.icon} className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <span className="flex-shrink-0 text-xs md:text-sm font-bold px-2.5 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                      {band.levelRange}
                    </span>
                    <span className="font-semibold text-sm md:text-base truncate">{band.section}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${routeExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {routeExpanded === index && (
                  <div className="px-4 md:px-5 pb-5 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{levelingRoute.areaLabel}: </span>
                      {band.area}
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1.5">{levelingRoute.targetsLabel}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {band.targets.map((target: string, ti: number) => (
                          <span key={ti} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs">
                            {target}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{levelingRoute.routeLabel}: </span>
                      {band.route}
                    </p>
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] border-t border-border pt-3">
                      <span className="font-semibold">{levelingRoute.priorityLabel}: </span>
                      {band.priority}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Raids, Drops, Swords, and Accessories */}
      <section id="raids-drops" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Gem className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />}
            title={raids.title}
            intro={raids.intro}
            linkData={moduleLinkMap["raidsDropsSwordsAndAccessories"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {raids.drops.map((drop: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <DynamicIcon name={drop.icon} className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">
                        {drop.source}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:flex-shrink-0">
                        {drop.rewardTypes.map((rt: string, ri: number) => (
                          <span key={ri} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                            {rt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">{raids.locationLabel}: </span>
                  {drop.area}
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground mb-1.5">{raids.rewardsLabel}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {drop.rewards.map((reward: string, ri: number) => (
                      <span key={ri} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-border text-xs">
                        <Check className="h-3 w-3 text-[hsl(var(--nav-theme-light))]" />
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{raids.valueLabel}: </span>
                  {drop.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{raids.bestForLabel}: </span>
                  {drop.bestFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/jujutsu-legacy-beta-1247159977181708288"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/15694107053/Jujutsu-Legacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/33596404/jujutsu-legacy-official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
