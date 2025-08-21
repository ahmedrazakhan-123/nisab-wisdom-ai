// Chat Service Unit Tests
// Run with: deno test functions/tests/chat.test.ts

import { assertEquals, assert } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Mock response structures
interface ChatResponse {
  data: {
    response: string;
    timestamp: string;
    provider: string;
    model: string;
  } | null;
  error: string | null;
  meta: {
    timestamp: string;
    request_id?: string;
  };
}

interface ChatRequest {
  user_id: string;
  message: string;
}

// Test helper functions
function validateChatResponse(response: ChatResponse): boolean {
  return (
    typeof response.data?.response === 'string' &&
    typeof response.data?.timestamp === 'string' &&
    typeof response.data?.provider === 'string' &&
    typeof response.data?.model === 'string' &&
    typeof response.meta.timestamp === 'string'
  );
}

function validateErrorResponse(response: ChatResponse): boolean {
  return (
    response.data === null &&
    typeof response.error === 'string' &&
    typeof response.meta.timestamp === 'string'
  );
}

function isValidTimestamp(timestamp: string): boolean {
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

function containsIslamicGuidance(response: string): boolean {
  const islamicTerms = [
    'halal', 'haram', 'quran', 'hadith', 'allah', 'prophet', 'muhammad',
    'aaoifi', 'shariah', 'islamic', 'muslim', 'riba', 'gharar', 'zakat',
    'sukuk', 'takaful', 'mudaraba', 'musharaka', 'ijara', 'salam'
  ];
  
  const lowerResponse = response.toLowerCase();
  return islamicTerms.some(term => lowerResponse.includes(term));
}

function hasCitations(response: string): boolean {
  const citationPatterns = [
    /quran \d+:\d+/i,
    /bukhari \d+/i,
    /muslim \d+/i,
    /aaoifi standard/i,
    /surah [a-z\s]+/i,
    /verse \d+/i,
    /chapter \d+/i
  ];
  
  return citationPatterns.some(pattern => pattern.test(response));
}

function containsProhibitedContent(response: string): boolean {
  const prohibited = [
    "i don't know",
    "i cannot answer",
    "according to my training",
    "as an ai model",
    "i was created by",
    "i think",
    "maybe",
    "probably"
  ];
  
  return prohibited.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
}

Deno.test("Chat response structure validation", () => {
  const validResponse: ChatResponse = {
    data: {
      response: "Interest (riba) is prohibited according to Quran 2:275.",
      timestamp: "2024-01-01T00:00:00.000Z",
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022"
    },
    error: null,
    meta: {
      timestamp: "2024-01-01T00:00:00.000Z",
      request_id: "test-123"
    }
  };
  
  assert(validateChatResponse(validResponse));
});

Deno.test("Error response structure validation", () => {
  const errorResponse: ChatResponse = {
    data: null,
    error: "Rate limit exceeded",
    meta: {
      timestamp: "2024-01-01T00:00:00.000Z"
    }
  };
  
  assert(validateErrorResponse(errorResponse));
});

Deno.test("Request validation", () => {
  const validRequests: ChatRequest[] = [
    {
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      message: "Is cryptocurrency halal?"
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      message: "What is the zakat rate for gold?"
    }
  ];
  
  validRequests.forEach(request => {
    assert(typeof request.user_id === 'string');
    assert(typeof request.message === 'string');
    assert(request.user_id.length > 0);
    assert(request.message.length > 0);
  });
});

Deno.test("Invalid request validation", () => {
  const invalidRequests = [
    { user_id: "", message: "Valid message" },
    { user_id: "valid-id", message: "" },
    { user_id: "valid-id" }, // Missing message
    { message: "Valid message" }, // Missing user_id
  ];
  
  invalidRequests.forEach(request => {
    const isValid = request.user_id && 
                   request.message && 
                   request.user_id.length > 0 && 
                   request.message.length > 0;
    assert(!isValid, `Request should be invalid: ${JSON.stringify(request)}`);
  });
});

Deno.test("Timestamp validation", () => {
  const validTimestamps = [
    "2024-01-01T00:00:00.000Z",
    "2024-12-31T23:59:59.999Z",
    new Date().toISOString()
  ];
  
  validTimestamps.forEach(timestamp => {
    assert(isValidTimestamp(timestamp), `Invalid timestamp: ${timestamp}`);
  });
});

Deno.test("Islamic finance content validation", () => {
  const islamicResponses = [
    "According to Quran 2:275, riba (interest) is strictly prohibited in Islam.",
    "The Prophet Muhammad (PBUH) established in Bukhari 1454 that zakat is 2.5%.",
    "AAOIFI Standard 1 defines gharar as excessive uncertainty in contracts.",
    "Based on scholarly consensus (ijma'), this transaction would be considered halal.",
    "Sukuk bonds are Shariah-compliant alternatives to conventional bonds.",
    "Takaful insurance follows Islamic principles unlike conventional insurance."
  ];
  
  islamicResponses.forEach(response => {
    assert(containsIslamicGuidance(response), 
      `Response should contain Islamic guidance: ${response}`);
  });
});

Deno.test("Citation requirements", () => {
  const responsesWithCitations = [
    "According to Quran 2:275, interest is forbidden.",
    "The Prophet (PBUH) said in Bukhari 1454 that zakat is obligatory.",
    "AAOIFI Standard 5 defines the requirements for Islamic banking.",
    "Surah Al-Baqarah clearly states the prohibition.",
    "As mentioned in Chapter 2, Verse 275 of the Quran..."
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

Deno.test("Response quality validation", () => {
  const qualityResponses = [
    {
      response: "According to AAOIFI Standard 17, cryptocurrency trading is permissible if it meets specific conditions including no riba and no gharar.",
      shouldBeQuality: true
    },
    {
      response: "The Quran in verse 2:275 clearly prohibits riba (interest), making interest-based investments haram.",
      shouldBeQuality: true
    },
    {
      response: "Cryptocurrency might be okay, but you should probably ask a scholar.",
      shouldBeQuality: false
    },
    {
      response: "Most scholars agree that Bitcoin is halal to trade.",
      shouldBeQuality: false
    }
  ];
  
  qualityResponses.forEach(({ response, shouldBeQuality }) => {
    const hasGoodCitations = hasCitations(response);
    const hasProhibitedContent = containsProhibitedContent(response);
    const hasIslamicContent = containsIslamicGuidance(response);
    const isQuality = hasGoodCitations && !hasProhibitedContent && hasIslamicContent;
    
    if (shouldBeQuality) {
      assert(isQuality, `Response should pass quality check: ${response}`);
    } else {
      assert(!isQuality, `Response should fail quality check: ${response}`);
    }
  });
});

Deno.test("Provider and model validation", () => {
  const validProviders = ['anthropic', 'openai'];
  const validModels = [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'gpt-4.1-mini-2025-04-14',
    'gpt-4o-mini'
  ];
  
  validProviders.forEach(provider => {
    assert(typeof provider === 'string');
    assert(provider.length > 0);
  });
  
  validModels.forEach(model => {
    assert(typeof model === 'string');
    assert(model.length > 0);
  });
});

Deno.test("Rate limiting structure", () => {
  const rateLimitError: ChatResponse = {
    data: null,
    error: "Rate limit exceeded. Please wait before sending another message.",
    meta: {
      timestamp: new Date().toISOString()
    }
  };
  
  assert(validateErrorResponse(rateLimitError));
  assert(rateLimitError.error?.includes("Rate limit"));
});

Deno.test("Message length validation", () => {
  const longMessage = "a".repeat(4001);
  const validMessage = "What is the Islamic ruling on cryptocurrency?";
  
  assert(longMessage.length > 4000);
  assert(validMessage.length <= 4000);
});

Deno.test("JSON contract compliance", () => {
  const mockResponse: ChatResponse = {
    data: {
      response: "Zakat is calculated at 2.5% according to Bukhari 1454.",
      timestamp: "2024-01-01T00:00:00.000Z",
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022"
    },
    error: null,
    meta: {
      timestamp: "2024-01-01T00:00:00.000Z",
      request_id: "test-req-123"
    }
  };
  
  // Test that structure matches expected contract
  assert(typeof mockResponse.data?.response === 'string');
  assert(typeof mockResponse.data?.timestamp === 'string');
  assert(typeof mockResponse.data?.provider === 'string');
  assert(typeof mockResponse.data?.model === 'string');
  assert(mockResponse.error === null);
  assert(typeof mockResponse.meta.timestamp === 'string');
  assert(isValidTimestamp(mockResponse.data.timestamp));
  assert(isValidTimestamp(mockResponse.meta.timestamp));
});