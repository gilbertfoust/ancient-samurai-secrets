import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import LibraryIndex from "./pages/LibraryIndex";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Remedies from "./pages/Remedies";
import RemedyDetail from "./pages/RemedyDetail";
import Herbs from "./pages/Herbs";
import HerbDetail from "./pages/HerbDetail";
import Oils from "./pages/Oils";
import OilDetail from "./pages/OilDetail";
import Acupressure from "./pages/Acupressure";
import AcupressureDetail from "./pages/AcupressureDetail";
import Prevention from "./pages/Prevention";
import Emergency from "./pages/Emergency";
import Screening from "./pages/Screening";
import Educational from "./pages/Educational";
import Narratives from "./pages/Narratives";
import NarrativeDetail from "./pages/NarrativeDetail";
import SearchResults from "./pages/SearchResults";
import TCMTutorial from "./pages/TCMTutorial";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 3D Library as the main entry */}
          <Route path="/" element={<LibraryIndex />} />

          {/* Traditional layout routes for direct navigation */}
          <Route element={<AppLayout />}>
            <Route path="/browse" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/remedies/:id" element={<RemedyDetail />} />
            <Route path="/herbs" element={<Herbs />} />
            <Route path="/herbs/:id" element={<HerbDetail />} />
            <Route path="/oils" element={<Oils />} />
            <Route path="/oils/:id" element={<OilDetail />} />
            <Route path="/acupressure" element={<Acupressure />} />
            <Route path="/acupressure/:id" element={<AcupressureDetail />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/educational" element={<Educational />} />
            <Route path="/narratives" element={<Narratives />} />
            <Route path="/narratives/:id" element={<NarrativeDetail />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
