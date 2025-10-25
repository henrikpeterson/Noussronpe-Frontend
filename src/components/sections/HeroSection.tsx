
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/Revision.png";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundPattern?: boolean;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink = "/", 
  backgroundPattern = false 
}: HeroProps) {
  return (
    <div className="relative py-16 px-4 bg-gradient-to-br from-professional-blue/5 via-professional-neutral-dark to-professional-blue-light/10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students learning together" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-professional-blue/5"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto text-professional-navy leading-tight">
          {title}
        </h1>
        <p className="text-xl text-professional-slate mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
        {ctaText && (
          <Button asChild size="lg" className="bg-professional-blue hover:bg-professional-blue-dark shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold">
            <a href={ctaLink} className="flex items-center gap-3">
              {ctaText}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
