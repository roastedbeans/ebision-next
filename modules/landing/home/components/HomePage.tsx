import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import CallForPapers from "./CallForPapers";
import ImageCarousel from "./ImageCarousel";
import Venue from "./Venue";

const HomePage = async () => {
  const t = await getTranslations("HomePage");
  const tCommon = await getTranslations("Common");

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Conference Info */}
          <div className="flex flex-col gap-8 w-full lg:w-1/2">
            <div className="flex flex-col gap-3">
              <h6 className="text-muted-foreground">{t("heroLabel")}</h6>
              <h1 className="text-primary">{t("heroTitle")}</h1>
              <p className="text-foreground max-w-xl">{t("heroDescription")}</p>
            </div>

            <div className="flex flex-col gap-3 border-l-2 border-primary/30 pl-5">
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">{t("dateLabel")}</span>{" "}
                {tCommon("dates")}
              </p>
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">{t("venueLabel")}</span>{" "}
                {tCommon("venue")}, {tCommon("location")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/author-instruction">
                  {tCommon("submitPaper")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/overview">{tCommon("learnMore")}</Link>
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

          <div className="flex justify-center">
            <div className="bg-background/60 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 flex flex-col items-center text-center gap-4 max-w-sm w-full transition-all hover:border-primary/30 hover:shadow-sm">
              <Image
                src="/assets/logo/ifip-logo.png"
                alt="IFIP Logo"
                width={80}
                height={35}
                loading="lazy"
                className="object-contain w-24 h-fit"
              />
              <div className="flex flex-col gap-1">
                <h5 className="text-foreground">{tCommon("organizer")}</h5>
                <small className="text-muted-foreground">{tCommon("organizerSubtitle")}</small>
              </div>
              <small className="text-primary font-medium">{t("organizerRole")}</small>
            </div>
          </div>
        </div>
      </section>

      {/* ── Venue Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-8xl mx-auto">
          <Venue />
        </div>
      </section>

      {/* ── Call for Papers Section ── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-8xl mx-auto">
          <CallForPapers />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
