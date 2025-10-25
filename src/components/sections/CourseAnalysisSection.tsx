
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Brain, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseAnalysisSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Analyse de cours PDF</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Transformez vos cours PDF en outils d'apprentissage interactifs. 
          Uploadez vos documents et générez automatiquement des résumés structurés ou des quiz personnalisés.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Upload facile</CardTitle>
            <CardDescription>
              Glissez-déposez vos cours PDF et laissez l'IA faire le travail
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-green-100">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Résumés intelligents</CardTitle>
            <CardDescription>
              Obtenez des résumés clairs et structurés de vos cours
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Quiz personnalisés</CardTitle>
            <CardDescription>
              Générez des QCM adaptés au contenu de vos cours
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="text-center">
        <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link to="/course-analysis" className="flex items-center gap-2">
            Commencer l'analyse
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
