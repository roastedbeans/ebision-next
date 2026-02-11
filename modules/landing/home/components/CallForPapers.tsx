import { ArrowRight, CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";
import { loadData } from "@/lib/data";

const glassCard = "bg-background/10 backdrop-blur-sm border border-border/60 rounded-lg";

interface CallForPapersData {
  title: string;
  description: string;
  topics: string[];
  importantDates: {
    originalPapers: { title: string; date: string; color: string }[];
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

      {/* Important Dates + Submission Guidelines Row */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Important Dates - Timeline */}
        <div className={`${glassCard} p-6 sm:p-8 flex flex-col gap-6 w-full lg:w-1/2`}>
          <h3 className="text-foreground flex items-center">
            <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
            {t("importantDatesTitle")}
          </h3>
          <div className="flex flex-col gap-2">
            <h5 className="text-primary-foreground bg-primary px-4 py-2 rounded-md">
              Original Papers
            </h5>
            <ol className="relative ml-4 mt-4">
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
        </div>

        {/* Submission Guidelines */}
        <div className={`${glassCard} p-6 sm:p-8 flex flex-col gap-6 w-full lg:w-1/2`}>
          <h3 className="text-foreground flex items-center">
            <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
            {t("submissionGuidelinesTitle")}
          </h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h5 className="text-foreground">Paper Categories</h5>
              <ul className="flex flex-col gap-2">
                {callForPapersData.submissionGuidelines.paperCategories.map((category, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <p className="text-foreground flex-1">{category}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h5 className="text-foreground">Key Requirements</h5>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">
                    <strong>Anonymous submission:</strong> No author names, affiliations, or
                    self-references
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">
                    <strong>PDF format:</strong> EasyChair LaTeX or Word template
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">
                    <strong>Page length:</strong> 5-20 pages in EasyChair style
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-foreground">
                    <strong>Original work:</strong> Must not overlap with published work
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* General Requirements */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h3 className="text-foreground flex items-center mb-4">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {t("generalRequirementsTitle")}
        </h3>
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

      {/* Submission Requirements */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h3 className="text-foreground flex items-center mb-6">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {t("submissionRequirementsTitle")}
        </h3>
        <ul className="flex flex-col gap-3 mb-6">
          {callForPapersData.submissionGuidelines.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary/60 mt-2.5 shrink-0 rounded-full" />
              <span className="text-foreground flex-1">
                {typeof requirement === "string" ? (
                  <p>{requirement}</p>
                ) : (
                  <p>
                    {requirement.text}
                    <a
                      href={requirement.link.href}
                      target={requirement.link.target}
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      {requirement.link.text}
                    </a>
                    {requirement.textAfter}
                    <a
                      href={requirement.link2.href}
                      target={requirement.link2.target}
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      {requirement.link2.text}
                    </a>
                    {requirement.textEnd}
                  </p>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border/60">
          <Button asChild variant="outline">
            <Link href={`/${year}/author-instruction`}>{tCommon("authorInstructions")}</Link>
          </Button>
          <p className="text-muted-foreground">
            For detailed guidelines, visit the{" "}
            <Link
              href={`/${year}/author-instruction`}
              className="text-primary hover:text-primary/80 underline"
            >
              Author Instructions page
            </Link>
          </p>
        </div>
      </div>

      {/* Proceedings & Post Publications */}
      <div className={`${glassCard} p-6 sm:p-8`}>
        <h3 className="text-foreground flex items-center mb-6">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {callForPapersData.proceedings.title}
        </h3>
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
        <h3 className="text-foreground flex items-center mb-6">
          <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
          {t("topicsTitle")}
        </h3>
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
