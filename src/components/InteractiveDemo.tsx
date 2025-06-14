
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-teal mb-3" style={{ fontFamily: "'Lora', serif" }}>
          Explore Examples
        </h2>
        <p className="text-gray-600 md:text-lg">
          See how Nisab.AI can answer common Islamic finance questions. Click a question to see a sample response.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-gold flex items-center mb-2">
            <Lightbulb className="w-5 h-5 mr-2"/>
            Sample Questions
          </h3>
          {demoQuestions.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-3 border-brand-gold/50 hover:bg-brand-gold/10 text-brand-teal ${selectedQuestion?.id === item.id ? 'bg-brand-gold/10 ring-2 ring-brand-gold' : ''}`}
              onClick={() => setSelectedQuestion(item)}
            >
              {item.question}
            </Button>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-brand-gold/20 min-h-[200px] flex flex-col">
          <h3 className="text-lg font-semibold text-brand-teal flex items-center mb-3">
            <Zap className="w-5 h-5 mr-2 text-brand-gold" />
            Sample Answer
          </h3>
          {selectedQuestion ? (
            <div className="text-sm text-gray-700 space-y-2 animate-fade-in">
              <p className="font-medium text-brand-teal">{selectedQuestion.question}</p>
              <p>{selectedQuestion.answer}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 flex-grow flex items-center justify-center">
              Click a question on the left to see a sample answer here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
