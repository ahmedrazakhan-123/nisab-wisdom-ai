import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, CheckCircle } from 'lucide-react';

interface Scholar {
  name: string;
  title: string;
  institution: string;
  region: string;
  image: string;
  quote: string;
  credentials: string[];
  verified: boolean;
}

const scholars: Scholar[] = [
  {
    name: "Dr. Abdullah Al-Mannai",
    title: "Islamic Finance Scholar",
    institution: "Qatar Islamic Bank",
    region: "Middle East",
    image: "/api/placeholder/64/64",
    quote: "Nisab.AI represents a significant advancement in making Islamic finance principles accessible to the modern Muslim investor.",
    credentials: ["PhD Islamic Finance", "Shariah Board Member", "25+ Years Experience"],
    verified: true
  },
  {
    name: "Ustadh Mahmoud Hassan",
    title: "Senior Shariah Advisor",
    institution: "AAOIFI",
    region: "Global",
    image: "/api/placeholder/64/64",
    quote: "The AI's understanding of complex Shariah principles is remarkably accurate and well-grounded in traditional scholarship.",
    credentials: ["MA Islamic Law", "AAOIFI Certified", "Author of 15 Books"],
    verified: true
  },
  {
    name: "Dr. Aishah Mustapha",
    title: "Islamic Economics Professor",
    institution: "International Islamic University Malaysia",
    region: "Southeast Asia",
    image: "/api/placeholder/64/64",
    quote: "An invaluable tool that bridges the gap between traditional Islamic finance knowledge and modern technological solutions.",
    credentials: ["PhD Economics", "University Professor", "Research Director"],
    verified: true
  }
];

export default function ScholarTestimonials() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-6" style={{ fontFamily: "'Lora', serif" }}>
            Endorsed by Leading Islamic Scholars
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Trusted and verified by renowned Islamic finance experts and Shariah scholars worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholars.map((scholar, index) => (
            <Card key={scholar.name} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-brand-teal">
                      {scholar.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {scholar.verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-white dark:bg-card rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{scholar.name}</h3>
                  </div>
                  <p className="text-sm text-brand-teal font-medium">{scholar.title}</p>
                  <p className="text-xs text-muted-foreground">{scholar.institution}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {scholar.region}
                  </Badge>
                </div>
              </div>

              <blockquote className="text-muted-foreground mb-4 italic">
                "{scholar.quote}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Badge variant="secondary" className="text-xs">
                  Verified Scholar
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Credentials:</p>
                <div className="flex flex-wrap gap-1">
                  {scholar.credentials.map((credential, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {credential}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card px-6 py-3 rounded-full shadow-sm border">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-foreground">
              All scholars independently verified through Islamic institutions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}