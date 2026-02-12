import { Award } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";
import { loadData } from "@/lib/data";

interface AwardRecipient {
  category: string;
  recipient?: string;
  authors?: string[];
  affiliation: string;
  recognition?: string;
  technology?: string;
  paperTitle?: string;
}

interface AwardRecipientsData {
  recipients: AwardRecipient[];
}

const glassCard =
  "bg-card/60 backdrop-blur-xl border border-border/60 rounded-lg shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md";

/** Category order matches the announcement page for consistency. */
const AWARD_CATEGORY_ORDER = [
  "Best Paper Award",
  "Best Student Paper Award",
  "Exemplary Lecturer Award",
  "Young Researcher Award",
  "Promising Graduate Student Award",
  "Industry Pioneer Award",
] as const;

function groupByCategory(recipients: AwardRecipient[]): Map<string, AwardRecipient[]> {
  const map = new Map<string, AwardRecipient[]>();
  for (const r of recipients) {
    const list = map.get(r.category) ?? [];
    list.push(r);
    map.set(r.category, list);
  }
  return map;
}

const RollOfHonorsPage = async ({ year }: { year: ValidYear }) => {
  const t = await getTranslations("AwardRecipientsPage");
  const data = await loadData<AwardRecipientsData>("award-recipients", year);
  const config = YEAR_CONFIG[year];
  const recipients = data.recipients ?? [];
  const byCategory = groupByCategory(recipients);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="max-w-8xl mx-auto flex flex-col gap-4">
          <h6 className="text-primary">{t("label")}</h6>
          <h1 className="text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground max-w-3xl">{t("subtitle", { year })}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>{config.conferenceName}</span>
            <span>{config.dates}</span>
            <span>
              {config.venue}, {config.location}
            </span>
          </div>
        </div>
      </section>

      {/* Recipients or Empty State */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="max-w-8xl mx-auto flex flex-col gap-10">
          {recipients.length === 0 ? (
            <div className={`${glassCard} overflow-hidden flex flex-col`}>
              <div className="h-1 w-full bg-primary/20 shrink-0" />
              <div className="p-12 sm:p-16 text-center">
                <Award className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-foreground font-medium mb-2">{t("emptyTitle")}</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {t("emptyDescription", { year })}
                </p>
              </div>
            </div>
          ) : (
            AWARD_CATEGORY_ORDER.map((category) => {
              const items = byCategory.get(category);
              if (!items || items.length === 0) return null;

              return (
                <div key={category} className="flex flex-col gap-6">
                  <h3 className="text-foreground flex items-center">
                    <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {items.map((item, index) => (
                      <div
                        key={`${category}-${index}`}
                        className={`${glassCard} overflow-hidden flex flex-col`}
                      >
                        <div className="h-1 w-full bg-primary/80 shrink-0" />
                        <div className="p-6 sm:p-8 flex flex-col gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                              <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {item.recipient && !item.authors && (
                                <>
                                  <p className="text-foreground font-semibold text-lg leading-tight">
                                    {item.recipient}
                                  </p>
                                  <p className="text-muted-foreground text-sm mt-1">
                                    {item.affiliation}
                                  </p>
                                  {item.technology && (
                                    <p className="text-muted-foreground text-sm mt-3 italic leading-relaxed">
                                      &quot;{item.technology}&quot;
                                    </p>
                                  )}
                                  {item.recognition && (
                                    <p className="text-muted-foreground text-sm mt-3 border-l-2 border-primary/30 pl-4 leading-relaxed">
                                      {item.recognition}
                                    </p>
                                  )}
                                </>
                              )}
                              {item.authors && (
                                <>
                                  <p className="text-foreground font-semibold text-lg leading-tight">
                                    {item.authors.join(", ")}
                                  </p>
                                  <p className="text-muted-foreground text-sm mt-1">
                                    {item.affiliation}
                                  </p>
                                  {item.paperTitle && (
                                    <p className="text-foreground text-sm mt-3 italic leading-relaxed">
                                      &quot;{item.paperTitle}&quot;
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default RollOfHonorsPage;
