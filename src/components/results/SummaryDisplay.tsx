
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Copy } from "lucide-react";

interface SummaryDisplayProps {
  summary: {
    title: string;
    mainPoints: string[];
    keyTerms: { term: string; definition: string }[];
    conclusion: string;
  };
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const handleCopy = () => {
    const summaryText = `
${summary.title}

Points principaux:
${summary.mainPoints.map(point => `• ${point}`).join('\n')}

Termes clés:
${summary.keyTerms.map(term => `• ${term.term}: ${term.definition}`).join('\n')}

Conclusion:
${summary.conclusion}
    `;
    navigator.clipboard.writeText(summaryText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Résumé généré
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">{summary.title}</h3>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-blue-600">Points principaux</h4>
            <ul className="space-y-2">
              {summary.mainPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-purple-600">Termes clés</h4>
            <div className="grid gap-3">
              {summary.keyTerms.map((term, index) => (
                <div key={index} className="border-l-4 border-purple-200 pl-4">
                  <dt className="font-medium text-purple-700">{term.term}</dt>
                  <dd className="text-gray-600">{term.definition}</dd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-green-600">Conclusion</h4>
            <p className="text-gray-700 bg-green-50 p-4 rounded-lg">{summary.conclusion}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
