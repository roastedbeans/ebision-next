"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getClientData } from "@/lib/data-registry";
import { useYear } from "@/providers/year-provider";

interface KeynoteSpeaker {
  speaker: string;
  title: string;
  abstract: string;
  image: string;
  biography: string;
}

const KeynoteCard = ({
  keynote,
  abstractLabel,
  biographyLabel,
}: {
  keynote: KeynoteSpeaker;
  abstractLabel: string;
  biographyLabel: string;
}) => {
  const speakerName = keynote.speaker.split(",")[0].trim();
  const affiliation = keynote.speaker.split(",").slice(1).join(",").trim();

  return (
    <div className="bg-background border border-border rounded-lg p-6 sm:p-8 flex flex-col gap-6">
      {/* Speaker Image and Info */}
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-row gap-4 items-start">
          <div className="shrink-0">
            <Image
              src={keynote.image}
              alt={`${speakerName} photo`}
              width={120}
              height={120}
              className="w-24 h-24 sm:w-30 sm:h-30 object-cover rounded-full border border-primary/10"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
          </div>
          <div className="flex-1 mt-2">
            <h2 className="text-foreground mb-2">{speakerName}</h2>
            <p className="text-muted-foreground mb-2">{affiliation}</p>
          </div>
        </div>
        {keynote.title !== "tbd" && <h3 className="text-primary">{keynote.title}</h3>}
      </div>

      {/* Abstract */}
      {keynote.abstract !== "tbd" && (
        <div className="flex flex-col gap-2">
          <h4 className="text-foreground">{abstractLabel}</h4>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {keynote.abstract}
          </div>
        </div>
      )}

      {/* Biography */}
      <div className="flex flex-col gap-2">
        <h4 className="text-foreground">{biographyLabel}</h4>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {keynote.biography}
        </div>
      </div>
    </div>
  );
};

const KeynotesPage = () => {
  const t = useTranslations("KeynotesPage");
  const locale = useLocale();
  const year = useYear();
  const keynotes = getClientData<KeynoteSpeaker[]>(year, locale, "keynotes");
  const guestSpeakers = getClientData<KeynoteSpeaker[]>(year, locale, "guest-speaker");

  return (
    <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 flex flex-col gap-8 sm:gap-12">
      {/* Keynote Speakers Header */}
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <h1 className="text-foreground text-center">{t("title")}</h1>
        <h3 className="text-muted-foreground text-center max-w-8xl">{t("subtitle", { year })}</h3>
      </div>

      {/* Keynotes Grid */}
      <div className="flex flex-col gap-8 sm:gap-12 max-w-8xl mx-auto">
        {keynotes.map((keynote, index) => (
          <KeynoteCard
            key={index}
            keynote={keynote}
            abstractLabel={t("abstract")}
            biographyLabel={t("biography")}
          />
        ))}
      </div>

      {/* Special Session Invited Speaker Header */}
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <h1 className="text-foreground text-center">{t("specialSessionTitle")}</h1>
        <h3 className="text-muted-foreground text-center max-w-8xl">
          {t("specialSessionSubtitle")}
        </h3>
      </div>

      {/* Special Session Speaker */}
      <div className="flex flex-col gap-8 sm:gap-12 max-w-8xl mx-auto">
        {guestSpeakers.map((speaker, index) => (
          <KeynoteCard
            key={`guest-${index}`}
            keynote={speaker}
            abstractLabel={t("abstract")}
            biographyLabel={t("biography")}
          />
        ))}
      </div>
    </section>
  );
};

export default KeynotesPage;
