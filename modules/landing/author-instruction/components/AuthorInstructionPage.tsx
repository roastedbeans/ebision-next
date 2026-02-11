import { ArrowRight, CheckCircle, Download, FileText } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";
import { loadData } from "@/lib/data";

interface ImportantDate {
  title: string;
  date: string;
  color: string;
}

interface CallForPapersData {
  importantDates: {
    originalPapers: ImportantDate[];
  };
}

const glassCard = "bg-card/60 backdrop-blur-xl border border-border/60 rounded-lg shadow-sm";

const AuthorInstructionPage = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("AuthorInstructionPage");
  const tCommon = await getTranslations("Common");
  const yearConfig = YEAR_CONFIG[year];
  const cfpData = await loadData<CallForPapersData>("call-for-papers", year);

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

      {/* Content */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="max-w-8xl mx-auto flex flex-col gap-10">
          {/* General Requirements */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("generalRequirements")}
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

          {/* Submission & Format — Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Paper Submission */}
            <div className={`${glassCard} p-6 sm:p-8 flex flex-col gap-4`}>
              <h3 className="text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                {t("paperSubmission")}
              </h3>
              <p className="text-muted-foreground">
                Authors are invited to submit original papers. Submissions must not substantially
                overlap with work that any of the authors have published elsewhere, or that is
                simultaneously under review for another conference with proceedings.
              </p>
              <p className="text-muted-foreground">
                An accepted paper must be registered before the registration deadline and presented
                at the symposium. Failure to register by the deadline will result in automatic
                withdrawal of the paper from the proceedings and the program.
              </p>
            </div>

            {/* File Format */}
            <div className={`${glassCard} p-6 sm:p-8 flex flex-col gap-4`}>
              <h3 className="text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                {t("fileFormat")}
              </h3>
              <p className="text-muted-foreground">
                PDF format prepared using one of the following templates:
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://easychair.org/publications/easychair.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  EasyChair LaTeX class file (US letter size)
                </a>
                <a
                  href="https://easychair.org/publications/easychair.docx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  EasyChair Microsoft Word template
                </a>
              </div>
            </div>
          </div>

          {/* Submission Requirements */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("submissionRequirements")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">
                  <strong>Anonymous submission:</strong> No author names, affiliations,
                  acknowledgments, or obvious self-references
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">
                  <strong>Page length:</strong> 5–20 pages in EasyChair style, excluding
                  bibliography and appendices
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">
                  <strong>Original work:</strong> Must not overlap with previously published work
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">
                  <strong>PDF format:</strong> Using EasyChair LaTeX or Word template
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-foreground">
                  <strong>Registration:</strong> At least one author must register and present the
                  paper
                </p>
              </div>
            </div>
          </div>

          {/* Important Dates — Timeline */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("importantDates")}
            </h3>
            <ol className="relative ml-4">
              {cfpData.importantDates.originalPapers.map((item, index, arr) => {
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
          </div>

          {/* Quick Reference */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-foreground flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
              {t("quickReference")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: FileText, label: "5–20 pages", detail: "EasyChair style" },
                { icon: FileText, label: "PDF format only", detail: "LaTeX or Word template" },
                { icon: CheckCircle, label: "Anonymous submission", detail: "No identifying info" },
                { icon: CheckCircle, label: "Original work", detail: "Not published elsewhere" },
                { icon: CheckCircle, label: "Registration required", detail: "Upon acceptance" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium">{item.label}</p>
                    <small className="text-muted-foreground">{item.detail}</small>
                  </div>
                </div>
              ))}
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
                  <Link href={yearConfig.submissionUrl} target="_blank">
                    {tCommon("submitPaper")}
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

export default AuthorInstructionPage;
