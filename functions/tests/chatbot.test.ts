// Islamic Chatbot Unit Tests
// Run with: deno test functions/tests/chatbot.test.ts

import { assertEquals, assert } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Mock response structures
interface ChatbotResponse {
  response: string;
  sources: Array<{
    title: string;
    source: string;
    reference: string;
  }>;
  confidence: 'high' | 'medium' | 'low';
}

// Test helper functions
function validateResponseStructure(response: ChatbotResponse): boolean {
  return (
    typeof response.response === 'string' &&
    Array.isArray(response.sources) &&
    ['high', 'medium', 'low'].includes(response.confidence)
  );
}

function hasCitations(response: string): boolean {
  // Check for common citation patterns
  const citationPatterns = [
    /Quran \d+:\d+/,
    /Bukhari \d+/,
    /Muslim \d+/,
    /AAOIFI Standard/,
    /Surah [A-Za-z\s]+/
  ];
  
  return citationPatterns.some(pattern => pattern.test(response));
}

function containsProhibitedContent(response: string): boolean {
  const prohibited = [
    'I don\'t know',
    'I cannot answer',
    'According to my training',
    'As an AI model',
    'I was created by',
    'I think',
    'maybe',
    'probably'
  ];
  
  return prohibited.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
}

Deno.test("Response structure validation", () => {
  const validResponse: ChatbotResponse = {
    response: "Interest (riba) is prohibited according to Quran 2:275.",
    sources: [
      {
        title: "Riba Prohibition",
        source: "Quran",
        reference: "Al-Baqarah 2:275"
      }
    ],
    confidence: "high"
  };
  
  assert(validateResponseStructure(validResponse));
});

Deno.test("Citation requirements", () => {
  const responsesWithCitations = [
    "According to Quran 2:275, interest is forbidden.",
    "The Prophet (PBUH) said in Bukhari 1454 that zakat is obligatory.",
    "AAOIFI Standard 5 defines the requirements for Islamic banking.",
    "Surah Al-Baqarah clearly states the prohibition."
  ];
  
  responsesWithCitations.forEach(response => {
    assert(hasCitations(response), `Response should have citations: ${response}`);
  });
});

Deno.test("Prohibited content detection", () => {
  const prohibitedResponses = [
    "I don't know the answer to this question.",
    "According to my training data, this might be correct.",
    "As an AI model, I cannot provide religious guidance.",
    "I think this is probably halal but I'm not sure."
  ];
  
  prohibitedResponses.forEach(response => {
    assert(containsProhibitedContent(response), 
      `Should detect prohibited content: ${response}`);
  });
});

Deno.test("Acceptable responses", () => {
  const acceptableResponses = [
    "According to Quran 2:275, riba (interest) is strictly prohibited in Islam.",
    "The Prophet Muhammad (PBUH) established in Bukhari 1454 that zakat is 2.5%.",
    "AAOIFI Standard 1 defines gharar as excessive uncertainty in contracts.",
    "Based on scholarly consensus (ijma'), this transaction would be considered halal."
  ];
  
  acceptableResponses.forEach(response => {
    assert(!containsProhibitedContent(response), 
      `Should not flag acceptable response: ${response}`);
    assert(hasCitations(response), 
      `Acceptable response should have citations: ${response}`);
  });
});

Deno.test("JSON contract compliance", () => {
  const mockApiResponse = {
    response: "Zakat is calculated at 2.5% according to Bukhari 1454.",
    sources: [
      {
        title: "Zakat Obligation",
        source: "Hadith",
        reference: "Bukhari 1454"
      }
    ],
    confidence: "high" as const
  };
  
  // Test that structure matches expected contract
  assert(typeof mockApiResponse.response === 'string');
  assert(Array.isArray(mockApiResponse.sources));
  assert(mockApiResponse.sources.length > 0);
  assert(['high', 'medium', 'low'].includes(mockApiResponse.confidence));
  
  // Test source structure
  mockApiResponse.sources.forEach(source => {
    assert(typeof source.title === 'string');
    assert(typeof source.source === 'string');
    assert(typeof source.reference === 'string');
  });
});

Deno.test("Response content quality", () => {
  const qualityChecks = [
    {
      name: "Specific Islamic guidance",
      response: "According to AAOIFI Standard 17, cryptocurrency trading is permissible if it meets specific conditions including no riba and no gharar.",
      shouldPass: true
    },
    {
      name: "Vague non-committal answer",
      response: "Cryptocurrency might be okay, but you should probably ask a scholar.",
      shouldPass: false
    },
    {
      name: "Well-sourced response",
      response: "The Quran in verse 2:275 clearly prohibits riba (interest), making interest-based investments haram.",
      shouldPass: true
    },
    {
      name: "Unsourced claim",
      response: "Most scholars agree that Bitcoin is halal to trade.",
      shouldPass: false
    }
  ];
  
  qualityChecks.forEach(({ name, response, shouldPass }) => {
    const hasGoodCitations = hasCitations(response);
    const hasProhibitedContent = containsProhibitedContent(response);
    const isQuality = hasGoodCitations && !hasProhibitedContent;
    
    if (shouldPass) {
      assert(isQuality, `${name}: Response should pass quality check`);
    } else {
      assert(!isQuality, `${name}: Response should fail quality check`);
    }
  });
});

Deno.test("System prompt hygiene validation", () => {
  // These would be used to validate the actual system prompt
  const requiredPromptElements = [
    "cite your sources",
    "Quran",
    "Hadith", 
    "AAOIFI",
    "never fabricate",
    "halal, haram, or doubtful",
    "scholarly consensus"
  ];
  
  const mockSystemPrompt = `You are an expert Islamic finance advisor. Always cite your sources (Quran verses, Hadith references, AAOIFI standards). Be clear about what is halal, haram, or doubtful. Never fabricate information. Rely on scholarly consensus when uncertain.`;
  
  requiredPromptElements.forEach(element => {
    assert(mockSystemPrompt.toLowerCase().includes(element.toLowerCase()),
      `System prompt should contain: ${element}`);
  });
});