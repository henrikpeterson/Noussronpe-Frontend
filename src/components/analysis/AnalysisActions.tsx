
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Clock, BookOpen } from "lucide-react";

interface AnalysisActionsProps {
  fileAnalysis: {
    title: string;
    pageCount: number;
    wordCount: number;
    mainTopics: string[];
    difficulty: string;
  };
  onGenerateSummary: () => void;
  onGenerateQuiz: () => void;
}

export default function AnalysisActions({ fileAnalysis, onGenerateSummary, onGenerateQuiz }: AnalysisActionsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Informations sur le fichier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Analyse du document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fileAnalysis.pageCount}</div>
              <div className="text-sm text-gray-500">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fileAnalysis.wordCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Mots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{fileAnalysis.mainTopics.length}</div>
              <div className="text-sm text-gray-500">Thèmes</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-600">{fileAnalysis.difficulty}</div>
              <div className="text-sm text-gray-500">Niveau</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <FileText className="h-6 w-6" />
              Résumer le cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Obtenez un résumé structuré et synthétique du contenu de votre cours.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4" />
              <span>~2-3 minutes</span>
            </div>
            <Button 
              onClick={onGenerateSummary} 
              className="w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700"
            >
              Générer le résumé
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Brain className="h-6 w-6" />
              Générer un quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Créez un QCM personnalisé basé sur le contenu de votre cours.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4" />
              <span>~3-5 minutes</span>
            </div>
            <Button 
              onClick={onGenerateQuiz} 
              className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700"
            >
              Créer le quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
