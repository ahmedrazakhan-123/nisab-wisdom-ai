
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Nisab.AI?",
    answer: "Nisab.AI is an intelligent chatbot designed to provide clear and accessible answers to your questions about Islamic finance, including topics like Zakat, Riba (interest), Halal investments, and inheritance."
  },
  {
    question: "Is the financial advice from Nisab.AI certified by scholars?",
    answer: "Nisab.AI is an informational tool and not a replacement for a qualified human scholar or financial advisor. While we strive for accuracy based on established Islamic jurisprudence, we always recommend consulting with a certified expert for binding religious rulings or significant financial decisions."
  },
  {
    question: "How is my personal and financial data protected?",
    answer: "We take your privacy seriously. All conversations are handled securely, and we do not store personally identifiable financial data. Our goal is to provide information without compromising your privacy."
  },
  {
    question: "What kind of topics can I ask about?",
    answer: "You can ask about a wide range of Islamic finance topics, such as how to calculate Zakat on different types of assets, understanding complex terms like Mudarabah and Musharakah, identifying Halal investment opportunities, and the principles of Islamic economics."
  },
  {
    question: "Is Nisab.AI free to use?",
    answer: "Nisab.AI offers a free tier so you can experience its capabilities. For more extensive use and advanced features, we offer premium subscription plans. Please see our Pricing page for more details."
  }
];

const FaqSection = () => {
  return (
    <section id="faq-section" className="py-16 md:py-24 bg-card/20 dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-brand-teal/80 dark:text-brand-teal-light/80 mb-12">
            Have questions? We've got answers. Here are some of the most common things people ask.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-brand-teal/20 dark:border-brand-teal-light/20">
                <AccordionTrigger className="text-left text-lg font-semibold text-brand-teal dark:text-brand-teal-light hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-brand-teal/90 dark:text-brand-teal-light/90">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
