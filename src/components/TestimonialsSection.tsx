import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialCard = ({ quote, author, title }: { quote: string, author: string, title: string }) => (
    <Card className="bg-background/50 dark:bg-background/20 border-border/50 h-full">
        <CardContent className="pt-6">
            <div className="flex mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-brand-gold fill-current" />)}
            </div>
            <p className="italic text-muted-foreground">"{quote}"</p>
            <p className="mt-4 font-semibold text-foreground">- {author}, <span className="text-muted-foreground font-normal">{title}</span></p>
        </CardContent>
    </Card>
);

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-card/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
                        Trusted by 10,000+ Muslims Worldwide
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of Muslims who trust Nisab.AI for their Shariah-compliant financial guidance.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        quote="Nisab.AI has been a game changer for my studies in Islamic finance. The answers are clear, well-sourced, and trustworthy."
                        author="Fatima A."
                        title="Finance Student"
                    />
                    <TestimonialCard 
                        quote="As a professional, I need quick and reliable answers. This tool saves me hours of research every week. The Pro plan is worth every penny."
                        author="Ahmed K."
                        title="Financial Advisor"
                    />
                    <TestimonialCard 
                        quote="The simplicity and accuracy is unmatched. I can finally get Shariah-compliant guidance without getting lost in complex jargon."
                        author="Yusuf M."
                        title="Small Business Owner"
                    />
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;