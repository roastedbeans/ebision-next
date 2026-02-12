import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { type NavRouteKey, type ValidYear, YEAR_CONFIG } from "@/constants/config";
import { loadData } from "@/lib/data";

interface ConferenceData {
  conferenceName: string;
  conferenceFullTitle: string;
}

const categoryKeys = {
  about: "about",
  program: "program",
  awards: "awards",
  participate: "participate",
} as const;

const Footer = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("Footer");
  const conf = await loadData<ConferenceData>("conference", year);

  const disabledRoutes = YEAR_CONFIG[year].disabledRoutes;
  const isDisabled = (key: NavRouteKey) => disabledRoutes.includes(key);

  const footerLinks = {
    about: [
      { key: "overview" as const, href: `/${year}/overview`, disabled: isDisabled("overview") },
      {
        key: "organization" as const,
        href: `/${year}/organization`,
        disabled: isDisabled("organization"),
      },
      {
        key: "lifetimeAchievement" as const,
        href: `/${year}/lifetime-achievement`,
        disabled: isDisabled("lifetimeAchievement"),
      },
      {
        key: "previousEvents" as const,
        href: `/${year}/previous-events`,
        disabled: isDisabled("previousEvents"),
      },
    ],
    program: [
      {
        key: "programSchedule" as const,
        href: `/${year}/program`,
        disabled: isDisabled("program"),
      },
      { key: "keynotes" as const, href: `/${year}/keynotes`, disabled: isDisabled("keynotes") },
    ],
    awards: [
      {
        key: "announcement" as const,
        href: `/${year}/announcement`,
        disabled: isDisabled("announcement"),
      },
      {
        key: "rollOfHonors" as const,
        href: `/${year}/roll-of-honors`,
        disabled: isDisabled("rollOfHonors"),
      },
    ],
    participate: [
      {
        key: "authorInstructions" as const,
        href: `/${year}/author-instruction`,
        disabled: isDisabled("authorInstructions"),
      },
      { key: "contact" as const, href: `/${year}/contact`, disabled: isDisabled("contact") },
    ],
  };

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Logo and Conference Info */}
          <div className="flex flex-col md:items-start items-center md:text-left text-center gap-4">
            <Image
              src="/assets/logo/ebision-logo.svg"
              alt="EBISION Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <div className="flex flex-col gap-1">
              <h5 className="text-foreground">{conf.conferenceName}</h5>
              <small className="text-muted-foreground">{conf.conferenceFullTitle}</small>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {(
              Object.entries(footerLinks) as [
                keyof typeof categoryKeys,
                (typeof footerLinks)[keyof typeof footerLinks],
              ][]
            ).map(([category, links]) => (
              <div key={category}>
                <h6 className="text-foreground mb-4">{t(categoryKeys[category])}</h6>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.key}>
                      {link.disabled ? (
                        <span className="text-muted-foreground/50 cursor-not-allowed pointer-events-none">
                          <small>{t(link.key)}</small>
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <small>{t(link.key)}</small>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8 flex justify-center items-center">
          <small className="text-muted-foreground">{t("copyright", { year })}</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
