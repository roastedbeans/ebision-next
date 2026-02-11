import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ValidYear } from "@/constants/config";
import { loadData } from "@/lib/data";

interface OrganizationMember {
  name: string;
  affiliation: string;
}

interface Organization {
  title: string;
  members: OrganizationMember[];
}

const glassCard = "bg-card/60 backdrop-blur-xl border border-border/60 rounded-lg shadow-sm";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

const MemberCard = ({ member }: { member: OrganizationMember }) => (
  <div
    className={`${glassCard} p-4 sm:p-5 flex items-center gap-4 transition-all hover:border-primary/30`}
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
      <span className="text-primary font-medium text-sm sm:text-base">
        {getInitials(member.name)}
      </span>
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-foreground font-medium truncate">{member.name}</p>
      <small className="text-muted-foreground truncate">{member.affiliation}</small>
    </div>
  </div>
);

const CompactMember = ({ member }: { member: OrganizationMember }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
      <span className="text-primary font-medium text-xs">{getInitials(member.name)}</span>
    </div>
    <div className="flex flex-col min-w-0">
      <p className="text-foreground text-sm font-medium truncate">{member.name}</p>
      <small className="text-muted-foreground text-xs truncate">{member.affiliation}</small>
    </div>
  </div>
);

const OrganizationPage = async ({ year }: { year: ValidYear }) => {
  const organizations = await loadData<Organization[]>("organization", year);

  // Split into leadership (small groups) and committee (large group)
  const leadershipRoles = organizations.filter((org) => org.members.length <= 4);
  const committeeRoles = organizations.filter((org) => org.members.length > 4);
  const t = await getTranslations("OrganizationPage");

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

      {/* IFIP Info */}
      <section className="px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
        <div className="max-w-8xl mx-auto">
          <div
            className={`${glassCard} p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6`}
          >
            <Image
              src="/assets/logo/ifip-logo.png"
              alt="IFIP Logo"
              width={80}
              height={35}
              loading="lazy"
              className="object-contain w-24 h-fit shrink-0"
            />
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h5 className="text-foreground">IFIP Working Group 8.4</h5>
              <small className="text-muted-foreground">{t("organizedBy")}</small>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Roles */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-8xl mx-auto flex flex-col gap-12">
          {leadershipRoles.map((organization, index) => (
            <div key={index} className="flex flex-col gap-5">
              <h3 className="text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                {organization.title}
              </h3>
              <div
                className={`grid gap-4 ${
                  organization.members.length === 1
                    ? "grid-cols-1 max-w-md"
                    : organization.members.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {organization.members.map((member, memberIndex) => (
                  <MemberCard key={memberIndex} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Committee Roles */}
      {committeeRoles.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <div className="max-w-8xl mx-auto flex flex-col gap-8">
            {committeeRoles.map((organization, index) => (
              <div key={index} className={`${glassCard} p-6 sm:p-8`}>
                <h3 className="text-foreground flex items-center mb-6">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                  {organization.title}
                  <span className="ml-3 bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {organization.members.length} {t("members")}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
                  {organization.members.map((member, memberIndex) => (
                    <CompactMember key={memberIndex} member={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OrganizationPage;
