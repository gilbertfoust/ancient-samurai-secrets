import { useState, useCallback, lazy, Suspense } from "react";
import { LibraryScene } from "@/components/library/LibraryScene";
import { BookPageTransition } from "@/components/library/BookPageTransition";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load content pages
const Recipes = lazy(() => import("@/pages/Recipes"));
const RecipeDetail = lazy(() => import("@/pages/RecipeDetail"));
const Remedies = lazy(() => import("@/pages/Remedies"));
const RemedyDetail = lazy(() => import("@/pages/RemedyDetail"));
const Herbs = lazy(() => import("@/pages/Herbs"));
const HerbDetail = lazy(() => import("@/pages/HerbDetail"));
const Oils = lazy(() => import("@/pages/Oils"));
const OilDetail = lazy(() => import("@/pages/OilDetail"));
const Acupressure = lazy(() => import("@/pages/Acupressure"));
const AcupressureDetail = lazy(() => import("@/pages/AcupressureDetail"));
const Prevention = lazy(() => import("@/pages/Prevention"));
const Emergency = lazy(() => import("@/pages/Emergency"));
const Screening = lazy(() => import("@/pages/Screening"));
const Educational = lazy(() => import("@/pages/Educational"));
const Narratives = lazy(() => import("@/pages/Narratives"));
const NarrativeDetail = lazy(() => import("@/pages/NarrativeDetail"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const TCMTutorial = lazy(() => import("@/pages/TCMTutorial"));

const BOOK_TITLES: Record<string, string> = {
  "/recipes": "Kitchen Formulary",
  "/remedies": "Condition Index",
  "/herbs": "Materia Medica",
  "/oils": "Aromatherapy Guide",
  "/acupressure": "Healing Points",
  "/prevention": "Lifestyle Guide",
  "/emergency": "First Aid Manual",
  "/screening": "Lifecycle Care",
  "/educational": "Learning Tools",
  "/narratives": "Cultural Stories",
  "/tcm": "Five Elements & TCM",
  "/search": "Search Results",
};

function PageLoader() {
  return (
    <div className="p-10 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid gap-4 grid-cols-2 mt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export default function LibraryIndex() {
  const [openBook, setOpenBook] = useState<string | null>(null);
  const [subPage, setSubPage] = useState<string | null>(null);

  const handleSelectBook = useCallback((path: string) => {
    setOpenBook(path);
    setSubPage(null);
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
    setSubPage(null);
  }, []);

  const navigateToDetail = useCallback((id: string) => {
    setSubPage(id);
  }, []);

  const navigateBack = useCallback(() => {
    setSubPage(null);
  }, []);

  const bookTitle = openBook ? BOOK_TITLES[openBook] || "Book" : "";

  const renderContent = () => {
    if (!openBook) return null;

    // We need a context to allow detail navigation within the book
    const detailProps = { navigateToDetail, navigateBack };

    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (openBook) {
            case "/recipes":
              return subPage ? <RecipeDetail /> : <Recipes />;
            case "/remedies":
              return subPage ? <RemedyDetail /> : <Remedies />;
            case "/herbs":
              return subPage ? <HerbDetail /> : <Herbs />;
            case "/oils":
              return subPage ? <OilDetail /> : <Oils />;
            case "/acupressure":
              return subPage ? <AcupressureDetail /> : <Acupressure />;
            case "/prevention":
              return <Prevention />;
            case "/emergency":
              return <Emergency />;
            case "/screening":
              return <Screening />;
            case "/educational":
              return <Educational />;
            case "/narratives":
              return subPage ? <NarrativeDetail /> : <Narratives />;
            case "/search":
              return <SearchResults />;
            case "/tcm":
              return <TCMTutorial />;
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <LibraryScene onSelectBook={handleSelectBook} />
      <BookPageTransition
        isOpen={openBook !== null}
        onClose={handleClose}
        bookTitle={bookTitle}
      >
        {renderContent()}
      </BookPageTransition>
    </div>
  );
}
