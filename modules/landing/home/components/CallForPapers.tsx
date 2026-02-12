import { ArrowRight, CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";
import { loadData } from "@/lib/data";

const glassCard = "bg-background/10 backdrop-blur-sm border border-border/60 rounded-lg";

const subsectionBlock =
  "pl-4 border-l-4 border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-r-lg py-4 pr-4";

const sectionHeader =
  "flex items-center gap-3 mb-5 pb-3 border-b border-border/60 text-lg font-semibold";

interface CallForPapersData {
  title: string;
  description: string;
  topics: string[];
  importantDates: {
    originalPapers: { title: string; date: string; color: string }[];
    posterPapers?: { title: string; date: string; color: string }[];
  };
  submissionGuidelines: {
    paperCategories: string[];
    requirements: (
      | string
      | {
          text: string;
          link: { text: string; href: string; target: string };
          textAfter: string;
          link2: { text: string; href: string; target: string };
          textEnd: string;
        }
    )[];
  };
  proceedings: { title: string; items: string[] };
  callToAction: {
    title: string;
    description: string;
    buttons: { text: string; type: string; link: string }[];
  };
  contact: { email: string; message: string };
}

const CallForPapers = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("CallForPapers");
  const tCommon = await getTranslations("Common");
  const callForPapersData = await loadData<CallForPapersData>("call-for-papers", year);
  const yearConfig = YEAR_CONFIG[year];
  return (
    <div className="flex flex-col gap-14">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h6 className="text-primary">Submissions</h6>
        <h2 className="text-foreground">{callForPapersData.title}</h2>
        <p className="text-muted-foreground max-w-xl">{callForPapersData.description}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
          <a
            href={yearConfig.cfpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" />
            Full Call for Papers (PDF)
          </a>
          <a
            href={yearConfig.cfpLeafletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" />
            CFP Leaflet (PDF)
          </a>
        </div>
      </div>

      {/* (1) Regular Paper & (2) Poster Paper — Two column */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* (1) Regular Paper */}
        <div
          className={`${glassCard} p-6 sm:p-8 flex flex-col gap-6 w-full ${
            callForPapersData.importantDates.posterPapers?.length ? "lg:w-1/2" : "lg:w-full"
          }`}
        >
          <h2 className={`${sectionHeader} text-foreground`}>{t("sectionRegularPaper")}</h2>
          <div className={subsectionBlock}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {t("importantDatesTitle")}
            </p>
            <ol className="relative ml-4">
              {callForPapersData.importantDates.originalPapers.map((dateItem, index) => {
                const isLast = index === callForPapersData.importantDates.originalPapers.length - 1;
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
                      <p className="text-foreground font-medium leading-snug">{dateItem.title}</p>
                      <small className="text-muted-foreground">{dateItem.date}</small>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className={subsectionBlock}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {t("submissionRequirementsTitle")}
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">{t("regularRequirementAnonymous")}</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">{t("regularRequirementPdfFormat")}</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">{t("regularRequirementPageLength")}</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">{t("regularRequirementOriginal")}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* (2) Poster Paper */}
        {callForPapersData.importantDates.posterPapers &&
        callForPapersData.importantDates.posterPapers.length > 0 ? (
          <div className={`${glassCard} p-6 sm:p-8 flex flex-col gap-6 w-full lg:w-1/2`}>
            <h2 className={`${sectionHeader} text-foreground`}>{t("sectionPosterPaper")}</h2>
            <div className={subsectionBlock}>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {t("importantDatesTitle")}
              </p>
              <ol className="relative ml-4">
                {callForPapersData.importantDates.posterPapers.map((dateItem, index) => {
                  const isLast =
                    index === (callForPapersData.importantDates.posterPapers?.length ?? 0) - 1;
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
                        <p className="text-foreground font-medium leading-snug">{dateItem.title}</p>
                        <small className="text-muted-foreground">{dateItem.date}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className={subsectionBlock}>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {t("submissionRequirementsTitle")}
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">{t("posterRequirementFormat")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">{t("posterRequirementAbstract")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">{t("posterRequirementDraft")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">{t("posterRequirementTrack", { year })}</p>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* General Requirements */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h2 className="text-foreground flex items-center mb-4 text-lg font-semibold">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {t("generalRequirementsTitle")}
        </h2>
        <p className="text-foreground">
          All papers must be original and not simultaneously submitted to another journal or
          conference. The contributions to EBISION {year} must be submitted to the conference
          submission system:{" "}
          <a
            href={yearConfig.submissionUrl}
            className="text-primary hover:text-primary/80 underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            EasyChair
          </a>
        </p>
      </div>

      {/* Full Guidelines Link */}
      <div
        className={`${glassCard} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4`}
      >
        <p className="text-muted-foreground">
          {t("fullGuidelinesNote")}{" "}
          <Link
            href={`/${year}/author-instruction`}
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            {t("authorInstructionsPage")}
          </Link>
          {t("fullGuidelinesSuffix") || "."}
        </p>
        <Button asChild variant="outline">
          <Link href={`/${year}/author-instruction`}>{tCommon("authorInstructions")}</Link>
        </Button>
      </div>

      {/* Proceedings & Post Publications */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h2 className="text-foreground flex items-center mb-6 text-lg font-semibold">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {callForPapersData.proceedings.title}
        </h2>
        <ul className="flex flex-col gap-3">
          {callForPapersData.proceedings.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary/60 mt-2.5 shrink-0 rounded-full" />
              <span className="text-foreground flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Topics of Interest */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h2 className="text-foreground flex items-center mb-6 text-lg font-semibold">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {t("topicsTitle")}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {callForPapersData.topics.map((topic, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary/60 mt-2.5 shrink-0 rounded-full" />
              <span className="text-foreground flex-1">{topic}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/90 backdrop-blur-xl rounded-lg p-8 sm:p-12 relative overflow-hidden">
        {/* Decorative blur blobs */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl"
        />
        <div className="relative text-center flex flex-col gap-6 items-center">
          <h2 className="text-primary-foreground">{callForPapersData.callToAction.title}</h2>
          <p className="text-primary-foreground/80 max-w-lg">
            {callForPapersData.callToAction.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {callForPapersData.callToAction.buttons.map((btn, index) => {
              const href = btn.link.startsWith("/") ? `/${year}${btn.link}` : btn.link;
              const isExternal = btn.link.startsWith("http");
              return (
                <Button
                  key={index}
                  asChild
                  variant={index === 0 ? "secondaryOutline" : "secondary"}
                >
                  {isExternal ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {btn.text}
                      {index > 0 && <ArrowRight className="h-4 w-4" />}
                    </a>
                  ) : (
                    <Link href={href}>
                      {btn.text}
                      {index > 0 && <ArrowRight className="h-4 w-4" />}
                    </Link>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-accent/60 backdrop-blur-xl rounded-lg border border-border/40 p-6 sm:p-8 text-center">
        <p className="text-foreground">
          {callForPapersData.contact.message}{" "}
          <Link
            href={`mailto:${callForPapersData.contact.email}`}
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            {callForPapersData.contact.email}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CallForPapers;
