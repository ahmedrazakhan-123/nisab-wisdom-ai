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

const qualifications = [
  {
    icon: "🎓",
    title: "Scholarly Knowledge Base",
    description: "Access authentic Islamic finance rulings sourced from established scholarly works and institutions"
  },
  {
    icon: "📖",
    title: "Quranic & Hadith References",
    description: "Every answer is backed by primary Islamic sources with proper citations and explanations"
  },
  {
    icon: "🏛️",
    title: "Modern Application",
    description: "Classical Islamic principles applied to contemporary financial instruments and situations"
  },
  {
    icon: "✅",
    title: "Compliance Verification",
    description: "Multi-layered verification process ensures accuracy and adherence to Islamic principles"
  }
];

export default function ScholarTestimonials() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-6" style={{ fontFamily: "'Lora', serif" }}>
            Built on Authentic Islamic Scholarship
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI is trained on verified Islamic finance knowledge from trusted scholarly sources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {qualifications.map((qualification, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{qualification.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{qualification.title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {qualification.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card px-6 py-3 rounded-full shadow-sm border">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-foreground">
              All content verified against established Islamic finance principles
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}