import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookPageTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  children: ReactNode;
}

export function BookPageTransition({ isOpen, onClose, bookTitle, children }: BookPageTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            className="fixed inset-0 bg-[#0D0907]/90 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Book opening animation */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full h-full max-w-6xl mx-auto overflow-hidden"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0, originX: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Book cover left page */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#4E342E]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />

              {/* Content page */}
              <motion.div
                className="absolute inset-0 bg-background overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {/* Book-style header */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
                  <div className="flex items-center gap-3 px-4 md:px-8 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="font-body text-sm">Return to Library</span>
                    </Button>
                    <div className="flex items-center gap-2 ml-auto">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-display text-sm font-semibold text-primary">{bookTitle}</span>
                    </div>
                  </div>
                </div>

                {/* Page content with book-like styling */}
                <div className="book-page-content">
                  {children}
                </div>

                {/* Decorative page edges */}
                <div className="fixed left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-[#3E2723]/20 to-transparent pointer-events-none z-20" />
                <div className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-border/30 to-transparent pointer-events-none z-20" />
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
