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
    const benefits = [
        {
            icon: "🎯",
            title: "Instant Shariah Compliance Check",
            description: "Get immediate answers about whether your financial decisions align with Islamic principles"
        },
        {
            icon: "📚",
            title: "Scholar-Verified Knowledge Base",
            description: "Access thousands of authentic Islamic finance rulings and explanations"
        },
        {
            icon: "💰",
            title: "Advanced Zakat Calculator",
            description: "Calculate your Zakat obligations accurately with our comprehensive calculator"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-card/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
                        Why Choose Nisab.AI?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experience the power of authentic Islamic finance guidance with these proven capabilities
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <Card key={index} className="bg-background/50 dark:bg-background/20 border-border/50 h-full">
                            <CardContent className="pt-6 text-center">
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;