"use client";

import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useYear } from "@/providers/year-provider";

interface Paper {
  id: string;
  session: string | null;
  articleId: string | null;
  presentationType: string;
  presentationDate: string | null;
  startTime: string | null;
  endTime: string | null;
  paperTitle: string;
  authors: string;
  institutions: string | null;
  abstractFileUrl: string | null;
  paperFileUrl: string | null;
}

interface ProceedingCard {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
}

interface ProceedingPeriod {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
}

interface Period {
  id: number;
  name: string;
  venue: string | null;
  date: string | null;
}

function ProceedingsPage() {
  const year = useYear();
  const t = useTranslations("ProceedingsPage");

  const [authState, setAuthState] = useState<{ authenticated: boolean; required: boolean } | null>(
    null,
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [cards, setCards] = useState<ProceedingCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [view, setView] = useState<"cards" | "detail">("cards");

  const [proceedingPeriod, setProceedingPeriod] = useState<ProceedingPeriod | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(["oral"]));

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/proceedings/auth");
      const data = await res.json();
      if (data.ok) {
        setAuthState({ authenticated: data.authenticated, required: data.required ?? false });
      }
    } catch {
      setAuthState({ authenticated: false, required: true });
    }
  }, []);

  const loadCards = useCallback(async () => {
    try {
      setCardsLoading(true);
      const res = await fetch(`/api/proceedings?year=${year}`);
      const data = await res.json();
      if (data.ok) {
        setCards(data.proceedingPeriods ?? []);
      }
    } catch (error) {
      console.error("Error loading proceedings:", error);
    } finally {
      setCardsLoading(false);
    }
  }, [year]);

  const loadDetail = useCallback(async () => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/user/proceedings?year=${year}`);
      const data = await response.json();

      if (response.status === 401) {
        setAuthState((prev) =>
          prev ? { ...prev, authenticated: false } : { authenticated: false, required: true },
        );
        setPasswordDialogOpen(true);
        return;
      }

      if (data.ok) {
        setProceedingPeriod(data.proceedingPeriod ?? null);
        setPeriod(data.period ?? null);
        setPapers(data.papers ?? []);
        setFilteredPapers(data.papers ?? []);
        setView("detail");
      }
    } catch (error) {
      console.error("Error loading proceeding:", error);
    } finally {
      setDetailLoading(false);
    }
  }, [year]);

  useEffect(() => {
    checkAuth();
    loadCards();
  }, [checkAuth, loadCards]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPapers(papers);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = papers.filter(
      (p) =>
        p.paperTitle.toLowerCase().includes(query) ||
        p.authors.toLowerCase().includes(query) ||
        (p.institutions?.toLowerCase().includes(query) ?? false) ||
        (p.session?.toLowerCase().includes(query) ?? false) ||
        (p.articleId?.toLowerCase().includes(query) ?? false),
    );
    setFilteredPapers(filtered);
  }, [searchQuery, papers]);

  const handleCardClick = () => {
    if (authState?.required && !authState?.authenticated) {
      setPasswordDialogOpen(true);
    } else {
      loadDetail();
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/proceedings/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuthState({ authenticated: true, required: true });
        setPasswordDialogOpen(false);
        setPassword("");
        loadDetail();
      } else {
        setPasswordError(data.error ?? t("passwordError"));
      }
    } catch {
      setPasswordError(t("passwordError"));
    } finally {
      setSubmitting(false);
    }
  };

  const groupByType = () => {
    const grouped: Record<string, Paper[]> = {};
    filteredPapers.forEach((paper) => {
      const type = paper.presentationType || "other";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(paper);
    });
    return grouped;
  };

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedPapers = groupByType();
  const presentationTypes = Object.keys(groupedPapers).sort();

  const formatCardDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // Cards view
  if (view === "cards" && !detailLoading) {
    return (
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 flex flex-col gap-8 sm:gap-12">
        <div className="max-w-8xl mx-auto flex flex-col gap-4 w-full">
          <h6 className="text-primary">{t("label")}</h6>
          <h1 className="text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground max-w-3xl">{t("subtitle")}</p>
        </div>

        {cardsLoading ? (
          <div className="max-w-8xl mx-auto w-full flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cards.length === 0 ? (
          <Card className="max-w-8xl mx-auto w-full">
            <CardContent className="text-center flex flex-col items-center gap-4 py-12">
              <FileText className="w-16 h-16 text-muted-foreground opacity-50 shrink-0" />
              <p className="text-muted-foreground">{t("empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-8xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card
                key={card.id}
                className="overflow-hidden cursor-pointer group pt-0"
                onClick={handleCardClick}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {card.coverImageUrl ? (
                    <Image
                      src={card.coverImageUrl}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
                      quality={90}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                      <FileText className="w-20 h-20 text-primary/40" />
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col gap-3">
                  <h3 className="line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-muted-foreground line-clamp-2">{card.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{formatCardDate(card.createdAt)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    {t("viewProgramBook")}
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {t("passwordPrompt")}
              </DialogTitle>
              <DialogDescription>{t("passwordDialogDescription")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 px-6 pb-6">
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                disabled={submitting}
                autoFocus
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("passwordSubmit")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  // Detail view (loading or content)
  return (
    <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 flex flex-col gap-8 sm:gap-12">
      <div className="max-w-8xl mx-auto flex flex-col gap-4 w-full">
        <h6 className="text-primary">{t("label")}</h6>
        <h1 className="text-foreground">{proceedingPeriod?.title ?? ""}</h1>
        {proceedingPeriod?.description && (
          <p className="text-muted-foreground max-w-3xl">{proceedingPeriod.description}</p>
        )}
      </div>

      {detailLoading ? (
        <div className="max-w-8xl mx-auto w-full flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-8xl mx-auto w-full flex flex-col gap-8 sm:gap-12">
          <div className="bg-muted rounded-lg">
            <div className="w-full flex flex-col gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                  {proceedingPeriod?.coverImageUrl ? (
                    <div className="relative aspect-[3/4] w-full rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={proceedingPeriod.coverImageUrl}
                        alt={proceedingPeriod.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                        quality={95}
                        priority
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full bg-linear-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center border">
                      <FileText className="w-20 h-20 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-9 flex flex-col gap-4">
                  {period && (
                    <div className="flex flex-col gap-2">
                      {period.date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <p>{period.date}</p>
                        </div>
                      )}
                      {period.venue && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <p>{period.venue}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {papers.length} {t("papers")}
                    </Badge>
                    <Badge variant="outline">
                      {presentationTypes.length} {t("presentationTypes")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredPapers.length === 0 ? (
            <Card>
              <CardContent className="text-center text-muted-foreground py-8">
                {searchQuery ? t("noSearchResults") : t("noPapers")}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {presentationTypes.map((type) => (
                <Card key={type} className="overflow-hidden py-0">
                  <button
                    type="button"
                    className="w-full bg-primary text-white p-4 flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors text-left"
                    onClick={() => toggleType(type)}
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 shrink-0" />
                      <h3 className="capitalize">{type} Presentations</h3>
                      <Badge variant="secondary">{groupedPapers[type].length}</Badge>
                    </div>
                    {expandedTypes.has(type) ? (
                      <ChevronUp className="w-5 h-5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                  {expandedTypes.has(type) && (
                    <CardContent>
                      {groupedPapers[type].map((paper, index) => (
                        <div key={paper.id}>
                          {index > 0 && <Separator />}
                          <div className="py-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  {paper.session && (
                                    <Badge variant="outline">{paper.session}</Badge>
                                  )}
                                  {paper.articleId && (
                                    <Badge variant="secondary">#{paper.articleId}</Badge>
                                  )}
                                  {(paper.presentationDate || paper.startTime) && (
                                    <>
                                      <span className="text-muted-foreground/50">•</span>
                                      <small className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {formatDate(paper.presentationDate)}
                                          {paper.startTime && ` ${paper.startTime}`}
                                          {paper.endTime && `-${paper.endTime}`}
                                        </span>
                                      </small>
                                    </>
                                  )}
                                </div>
                                <h3 className="text-foreground">
                                  {paper.paperFileUrl ? (
                                    <Link
                                      href={paper.paperFileUrl}
                                      target="_blank"
                                      className="text-primary hover:underline"
                                    >
                                      {paper.paperTitle}
                                    </Link>
                                  ) : (
                                    paper.paperTitle
                                  )}
                                </h3>
                                <div className="text-muted-foreground flex flex-col gap-1">
                                  <p>{paper.authors}</p>
                                  {paper.institutions && <small>{paper.institutions}</small>}
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col gap-2 sm:ml-4 shrink-0">
                                {paper.abstractFileUrl && (
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const url = paper.abstractFileUrl;
                                      if (url) window.open(url, "_blank");
                                    }}
                                    className="flex items-center"
                                    title="Download Abstract"
                                  >
                                    <FileText className="w-4 h-4 shrink-0" />
                                    <span className="hidden sm:inline">Abstract</span>
                                  </Button>
                                )}
                                {paper.paperFileUrl && (
                                  <Button
                                    variant="default"
                                    onClick={() => {
                                      const url = paper.paperFileUrl;
                                      if (url) window.open(url, "_blank");
                                    }}
                                    className="flex items-center"
                                    title="Download Full Paper"
                                  >
                                    <Download className="w-4 h-4 shrink-0" />
                                    <span className="hidden sm:inline">Paper</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ProceedingsPage;
