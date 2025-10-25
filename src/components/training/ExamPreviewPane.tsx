import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamPreviewPaneProps {
  examTitle: string;
  examUrl?: string;
  className?: string;
}

const ExamPreviewPane = ({ examTitle, examUrl, className }: ExamPreviewPaneProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);

  return (
    <div
      className={cn(
        "h-full transition-all duration-300",
        isCollapsed ? "w-12" : isFullWidth ? "w-full" : "w-full",
        className
      )}
    >
      <Card className={cn(
        "h-full flex flex-col overflow-hidden border-border/40 shadow-lg",
        "bg-gradient-to-br from-background to-muted/20"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 p-3 border-b bg-card/50 backdrop-blur-sm">
          {!isCollapsed && (
            <h3 className="font-semibold text-sm truncate flex-1">
              📄 {examTitle}
            </h3>
          )}
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsFullWidth(!isFullWidth)}
              >
                {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="flex-1 overflow-auto p-4 bg-background/50">
            {examUrl ? (
              <iframe
                src={examUrl}
                className="w-full h-full min-h-[600px] rounded-lg border bg-white"
                title={examTitle}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Aperçu de l'épreuve</h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Le document de l'épreuve s'affichera ici. Vous pourrez consulter les consignes
                    tout en répondant aux questions.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamPreviewPane;
