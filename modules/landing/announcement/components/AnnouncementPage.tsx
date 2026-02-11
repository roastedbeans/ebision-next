import { ArrowRight, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { ValidYear } from "@/constants/config";
import { loadData } from "@/lib/data";

interface ConferenceData {
  conferenceName: string;
  dates: string;
  venue: string;
  location: string;
}

interface AnnouncementDate {
  title: string;
  date: string;
}

interface AnnouncementData {
  importantDates: AnnouncementDate[];
}

const glassCard = "bg-card/60 backdrop-blur-xl border border-border/60 rounded-lg shadow-sm";

const AWARD_CATEGORIES = [
  {
    id: "1-1",
    title: "Best Paper Award",
    description:
      "All papers submitted to the conference, regardless of authorship, are eligible for the Best Paper Award. This includes work by students, academic faculty, industry professionals, and research practitioners. Papers will be evaluated for originality, scientific merit, and the significance of their contributions to the field. All qualified papers will be automatically considered—no separate nomination is necessary.",
    autoNomination: true,
  },
  {
    id: "1-2",
    title: "Best Student Paper Award",
    description:
      "Papers are eligible for the Best Student Paper Award if a student is listed as the first author. The student must be enrolled in an academic institution at the time of paper submission. While faculty members and other researchers may be listed as co-authors, the student\u2019s contribution must be clearly predominant. All qualified papers will be automatically considered—no separate nomination is necessary.",
    autoNomination: true,
  },
  {
    id: "1-3",
    title: "Exemplary Lecturer Award",
    description:
      "This award honors an individual who has demonstrated outstanding contributions to education and knowledge dissemination in e-business information systems. The recipient will have a strong record of impactful lectures, tutorials, or academic outreach that has significantly influenced the field and fostered professional development among peers and students. Self-nominations are not permitted.",
    autoNomination: false,
  },
  {
    id: "1-4",
    title: "Young Researcher Award",
    description:
      "This award is presented to a rising star in E\u2011Business Information Systems who has demonstrated extraordinary promise through early-career research achievements. Nominees will have shown the potential for significant long-term impact with innovative work and academic engagement. Self-nominations are not permitted.",
    autoNomination: false,
  },
  {
    id: "1-5",
    title: "Promising Graduate Student Award",
    description:
      "This award recognizes a graduate student who has demonstrated exceptional research acumen, made meaningful contributions to the E-Business Information Systems academic community, and shows great promise for a future academic or professional career. Nominees are required to be current Master\u2019s or Ph.D. students. A letter of recommendation from the student\u2019s supervisor or advisor is mandatory.",
    autoNomination: false,
  },
  {
    id: "1-6",
    title: "Industry Pioneer Award",
    description:
      "This award celebrates an individual or team from the industry sector who has successfully initiated and implemented groundbreaking industrial innovation within the E-Business Information Systems field. The recipient\u2019s work must demonstrate practical success, measurable impact, and significant advancement of industry standards or practices. Final award recipients are required to deliver a 5-minute presentation on their innovation achievements during the Industrial & Innovation Session.",
    autoNomination: false,
  },
];

const NOMINATION_REQUIREMENTS = [
  "Curriculum Vitae (CV)",
  "Summary of major research achievements and contributions",
  "Record of teaching or relevant service accomplishments (where appropriate)",
  "Supporting documentation for achievements (e.g., publication lists, awards, project reports)",
  "[For Promising Graduate Student Award only] A Letter of Recommendation from the nominee\u2019s supervisor",
  "[For Industry Pioneer Award only] A maximum of 5 slides showcasing the innovation achievements in the E-Business Information System",
];

const AnnouncementPage = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("AnnouncementPage");
  const tCommon = await getTranslations("Common");
  const conf = await loadData<ConferenceData>("conference", year);
  const announcementData = await loadData<AnnouncementData>("announcement", year);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="max-w-8xl mx-auto flex flex-col gap-4">
          <h6 className="text-primary">{t("label")}</h6>
          <h1 className="text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground max-w-3xl">{t("subtitle", { year })}</p>
        </div>
      </section>

      {/* Award Categories Overview */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="max-w-8xl mx-auto flex flex-col gap-10">
          {/* Categories Grid */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("awardCategories")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AWARD_CATEGORIES.map((award) => (
                <div
                  key={award.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/40"
                >
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-foreground font-medium">{award.title}</p>
                    <small className="text-muted-foreground">
                      {award.autoNomination ? t("automaticConsideration") : t("nominationRequired")}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Award Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {AWARD_CATEGORIES.map((award) => (
              <div key={award.id} className={`${glassCard} p-6 sm:p-8 flex flex-col gap-4`}>
                <h3 className="text-foreground flex items-center">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                  {award.title}
                </h3>
                <p className="text-muted-foreground">{award.description}</p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <small
                    className={`px-2.5 py-0.5 rounded-full font-medium ${
                      award.autoNomination
                        ? "bg-primary/10 text-primary"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {award.autoNomination ? t("autoConsidered") : t("nominationRequired")}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Nomination Requirements */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("nominationSubmissionRequirements")}
            </h3>
            <p className="text-muted-foreground mb-6">
              Submission of nomination materials is required only for the Exemplary Lecturer, Young
              Researcher, Promising Graduate Student, and Industry Pioneer Awards. All accepted
              papers are considered automatically for the Best Paper Award and Best Student Paper
              Award; no separate application or nomination is needed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NOMINATION_REQUIREMENTS.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Method */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("submissionMethod")}
            </h3>
            <p className="text-muted-foreground mb-6">{t("submissionDescription")}</p>
            <Button asChild size="lg">
              <Link href={`/${year}/portal`}>
                {t("goToPortal")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="mt-6 pt-4 border-t border-border/60">
              <small className="text-muted-foreground">
                For questions or assistance, please contact{" "}
                <a
                  href="mailto:cyberchair.ebision@gmail.com"
                  className="text-primary hover:text-primary/80 underline"
                >
                  cyberchair.ebision@gmail.com
                </a>
              </small>
            </div>
          </div>

          {/* Important Dates — Timeline */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("importantDates")}
            </h3>
            <ol className="relative ml-4">
              {announcementData.importantDates.map((item, index, arr) => {
                const isLast = index === arr.length - 1;
                return (
                  <li key={index} className={`relative pl-8 ${isLast ? "" : "pb-8"}`}>
                    {!isLast && (
                      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-primary/20" />
                    )}
                    <div className="absolute left-0 top-1.5 flex items-center justify-center">
                      <div className="w-[15px] h-[15px] rounded-full border-2 border-primary bg-card/80" />
                      <div className="absolute w-[7px] h-[7px] rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-foreground font-medium leading-snug">{item.title}</p>
                      <small className="text-muted-foreground">{item.date}</small>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 p-4 bg-accent/40 rounded-lg">
              <small className="text-foreground">
                <strong>Note:</strong>{" "}
                {t("attendanceNote", {
                  year,
                  venue: conf.venue,
                  location: conf.location,
                  dates: conf.dates,
                })}
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="max-w-8xl mx-auto">
          <div className="bg-primary/90 backdrop-blur-xl rounded-lg p-8 sm:p-12 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl"
            />
            <div className="relative text-center flex flex-col gap-6 items-center">
              <h2 className="text-primary-foreground">{t("ctaTitle")}</h2>
              <p className="text-primary-foreground/80">{t("ctaDescription", { year })}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="secondaryOutline">
                  <Link href={`mailto:${tCommon("email")}`}>{tCommon("email")}</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/${year}/portal`}>
                    {t("goToPortal")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnouncementPage;
