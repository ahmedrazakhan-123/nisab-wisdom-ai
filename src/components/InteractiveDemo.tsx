import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, Image as ImageIcon } from 'lucide-react';

interface DemoQuestion {
  id: string;
  question: string;
  answer: string;
}

const demoQuestions: DemoQuestion[] = [
  { id: '1', question: 'What is Riba?', answer: 'Riba means increase or excess. In Islamic finance, it commonly refers to interest charged on loans. It is prohibited in Islam as it is seen as exploitative.' },
  { id: '2', question: 'How is Zakat calculated on savings?', answer: 'Zakat on savings is typically 2.5% of the total savings that have been held for a full lunar year, provided the amount is above the Nisab threshold.' },
  { id: '3', question: 'Are cryptocurrency investments Halal?', answer: 'The Halal status of cryptocurrency is a debated topic among scholars. Some view certain cryptocurrencies as permissible if they meet specific criteria (e.g., not used for illicit purposes, having real-world utility), while others are more cautious or consider them Haram due to volatility and speculative nature. Nisab.AI can provide nuanced perspectives based on scholarly opinions.' },
];

const InteractiveDemo: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<DemoQuestion | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-teal dark:text-brand-teal-light mb-3" style={{ fontFamily: "'Lora', serif" }}>
          Explore Examples
        </h2>
        <p className="text-muted-foreground md:text-lg">
          See how Nisab.AI can answer common Islamic finance questions. Click a question to see a sample response.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-gold dark:text-brand-gold flex items-center mb-2">
            <Lightbulb className="w-5 h-5 mr-2"/>
            Sample Questions
          </h3>
          {demoQuestions.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-3 border-brand-gold/50 hover:bg-brand-gold/10 text-brand-teal dark:text-brand-teal-light dark:border-brand-gold/70 dark:hover:bg-brand-gold/20 ${selectedQuestion?.id === item.id ? 'bg-brand-gold/10 ring-2 ring-brand-gold dark:bg-brand-gold/20 dark:ring-brand-gold' : ''}`}
              onClick={() => setSelectedQuestion(item)}
            >
              {item.question}
            </Button>
          ))}
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg border border-brand-gold/20 dark:border-brand-gold/30 min-h-[250px] flex flex-col">
          <h3 className="text-lg font-semibold text-brand-teal dark:text-brand-teal-light flex items-center mb-3">
            <Zap className="w-5 h-5 mr-2 text-brand-gold dark:text-brand-gold" />
            Sample Answer
          </h3>
          {selectedQuestion ? (
            <div className="text-sm text-muted-foreground space-y-2 animate-fade-in">
              <p className="font-medium text-brand-teal dark:text-brand-teal-light">{selectedQuestion.question}</p>
              <p>{selectedQuestion.answer}</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground flex-grow flex flex-col items-center justify-center text-center">
              <img src="/placeholder.svg" alt="Nisab.AI chat interface mockup" className="w-48 h-32 object-contain mb-4 opacity-70" />
              <p>Click a question on the left to see a sample answer.</p>
              <p className="text-xs mt-1">(Replace placeholder image with actual mockup)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
