
import React from 'react';
import HowItWorksCard from './HowItWorksCard';
import { HelpCircle, Cpu, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: HelpCircle,
    title: "Ask Your Question",
    description: "Pose any Islamic finance query you have, big or small. Our AI is ready to listen.",
  },
  {
    icon: Cpu,
    title: "Receive AI Insights",
    description: "Our Shariah-aware AI analyzes your question and provides clear, intelligent answers.",
  },
  {
    icon: CheckCircle2,
    title: "Make Confident Decisions",
    description: "Use the guidance to navigate your finances with peace of mind and Shariah compliance.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-brand-cream section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Simple Steps to Financial Clarity
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Getting started with Nisab is easy. Follow these simple steps to gain valuable insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <HowItWorksCard
              key={step.title}
              icon={step.icon}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              animationDelay={`${index * 0.15}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
