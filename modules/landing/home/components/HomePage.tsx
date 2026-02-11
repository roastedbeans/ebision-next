import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { ValidYear } from "@/constants/config";
import { loadData } from "@/lib/data";
import CallForPapers from "./CallForPapers";
import ImageCarousel from "./ImageCarousel";
import Venue from "./Venue";

interface Collaborator {
  name: string;
  subtitle: string;
  role: string;
  logo: string;
}

interface ConferenceData {
  conferenceName: string;
  conferenceFullTitle: string;
  dates: string;
  venue: string;
  location: string;
  collaborators?: Collaborator[];
}

const HomePage = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("HomePage");
  const tCommon = await getTranslations("Common");
  const conf = await loadData<ConferenceData>("conference", year);
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Conference Info */}
          <div className="flex flex-col gap-8 w-full lg:w-1/2">
            <div className="flex flex-col gap-3">
              <h6 className="text-muted-foreground">{t("heroLabel")}</h6>
              <h1 className="text-primary">{conf.conferenceName}</h1>
              <p className="text-foreground max-w-xl">{conf.conferenceFullTitle}</p>
            </div>

            <div className="flex flex-col gap-3 border-l-2 border-primary/30 pl-5">
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">{t("dateLabel")}</span> {conf.dates}
              </p>
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">{t("venueLabel")}</span> {conf.venue},{" "}
                {conf.location}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href={`/${year}/author-instruction`}>
                  {tCommon("submitPaper")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${year}/overview`}>{tCommon("learnMore")}</Link>
              </Button>
            </div>
          </div>

          {/* Right: Image Carousel */}
          <div className="w-full lg:w-1/2">
            <ImageCarousel />
          </div>
        </div>
      </section>

      {/* ── Organized By ── */}
      <section className=" border-y border-border/40 px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-8xl mx-auto flex flex-col gap-8">
          <div className="text-center">
            <h6 className="text-primary mb-2">{t("collaboratorsLabel")}</h6>
            <h3 className="text-foreground">{t("collaboratorsTitle")}</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {(conf.collaborators ?? []).map((collab) => (
              <div
                key={collab.name}
                className="bg-background/60 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 flex flex-col items-center text-center gap-4 max-w-sm w-full transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <small className="text-primary font-medium">{collab.role}</small>
                <Image
                  src={collab.logo}
                  alt={`${collab.name} Logo`}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="object-contain w-24 h-16 dark:invert"
                />
                <div className="flex flex-col gap-1">
                  <h5 className="text-foreground">{collab.name}</h5>
                  <small className="text-muted-foreground">{collab.subtitle}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Venue Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-8xl mx-auto">
          <Venue year={year} />
        </div>
      </section>

      {/* ── Call for Papers Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-8xl mx-auto">
          <CallForPapers year={year} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
