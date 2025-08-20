// Nisab Chatbot Load Test
// Run with: k6 run k6/chatbot_load_test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const chatbotResponseTime = new Trend('chatbot_response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 50 },    // Stay at 50 users  
    { duration: '2m', target: 100 },   // Scale to 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests under 1.5s
    errors: ['rate<0.01'],             // Error rate under 1%
    chatbot_response_time: ['p(95)<1500'],
  },
};

// Test data
const queries = [
  'Is cryptocurrency trading halal in Islam?',
  'What is the ruling on forex trading?', 
  'How is zakat calculated on investments?',
  'Are index funds permissible in Islamic finance?',
  'What makes a stock Sharia compliant?',
  'Can I invest in companies with debt?',
  'What is gharar in Islamic finance?',
  'Is day trading allowed in Islam?',
  'How do I purify my income from haram sources?',
  'What are the requirements for Islamic banking?',
];

const userIds = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
];

export default function () {
  const baseUrl = 'https://rsugotioapwxuelehsml.supabase.co/functions/v1';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWdvdGlvYXB3eHVlbGVoc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Nzg0OTQsImV4cCI6MjA3MTE1NDQ5NH0._qoXGjLk2SWpoV-VnTKkTicZiOEEs84HZ5QFrTiSAWU';
  
  // Select random query and user
  const query = queries[Math.floor(Math.random() * queries.length)];
  const userId = userIds[Math.floor(Math.random() * userIds.length)];
  
  const payload = JSON.stringify({
    query: query,
    user_id: userId,
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
      'Idempotency-Key': `load-test-${__VU}-${__ITER}`, // Unique key per request
    },
  };
  
  // Make request
  const startTime = new Date();
  const response = http.post(`${baseUrl}/islamic-chatbot`, payload, params);
  const endTime = new Date();
  const responseTime = endTime - startTime;
  
  // Record custom metrics
  chatbotResponseTime.add(responseTime);
  
  // Validate response
  const isSuccess = check(response, {
    'status is 200': (r) => r.status === 200,
    'response has correct structure': (r) => {
      try {
        const json = JSON.parse(r.body);
        return json.response && json.sources && json.confidence;
      } catch {
        return false;
      }
    },
    'response contains citations': (r) => {
      try {
        const json = JSON.parse(r.body);
        const citationPattern = /Quran|Hadith|Bukhari|Muslim|AAOIFI/;
        return citationPattern.test(json.response);
      } catch {
        return false;
      }
    },
    'response time under 1500ms': (r) => responseTime < 1500,
    'no hallucination markers': (r) => {
      try {
        const json = JSON.parse(r.body);
        const prohibited = [
          "I don't know",
          "I cannot answer", 
          "According to my training",
          "As an AI model",
          "I think",
          "maybe",
          "probably"
        ];
        return !prohibited.some(phrase => 
          json.response.toLowerCase().includes(phrase.toLowerCase())
        );
      } catch {
        return false;
      }
    },
  });
  
  // Track errors
  errorRate.add(!isSuccess);
  
  // Log failures for debugging
  if (!isSuccess) {
    console.log(`Request failed: ${response.status} - ${response.body.substring(0, 200)}`);
  }
  
  // Rate limiting - don't hammer the API
  sleep(Math.random() * 2 + 1); // Sleep 1-3 seconds between requests
}

// Setup function - runs once before the test
export function setup() {
  console.log('Starting Nisab chatbot load test...');
  console.log(`Test will simulate up to 100 concurrent users`);
  console.log(`SLO: p95 response time < 1500ms, error rate < 1%`);
  
  // Warm up the service with a single request
  const baseUrl = 'https://rsugotioapwxuelehsml.supabase.co/functions/v1';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWdvdGlvYXB3eHVlbGVoc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Nzg0OTQsImV4cCI6MjA3MTE1NDQ5NH0._qoXGjLk2SWpoV-VnTKkTicZiOEEs84HZ5QFrTiSAWU';
  
  const warmupPayload = JSON.stringify({
    query: 'What is riba?',
    user_id: '11111111-1111-1111-1111-111111111111',
  });
  
  const warmupParams = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
  };
  
  const warmupResponse = http.post(`${baseUrl}/islamic-chatbot`, warmupPayload, warmupParams);
  console.log(`Warmup request status: ${warmupResponse.status}`);
}

// Teardown function - runs once after the test
export function teardown() {
  console.log('Load test completed.');
}

// Handle different test scenarios
export function handleSummary(data) {
  const summary = {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
  
  // Check if thresholds passed
  const thresholdsPassed = data.metrics.http_req_duration && 
    data.metrics.http_req_duration.values['p(95)'] < 1500 &&
    data.metrics.errors && 
    data.metrics.errors.values.rate < 0.01;
  
  if (!thresholdsPassed) {
    console.log('❌ LOAD TEST FAILED - SLO thresholds not met');
    summary['junit.xml'] = junitReport(data);
  } else {
    console.log('✅ LOAD TEST PASSED - All SLO thresholds met');
  }
  
  return summary;
}

// Budget guard test - separate test scenario
export function budgetGuardTest() {
  const baseUrl = 'https://rsugotioapwxuelehsml.supabase.co/functions/v1';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWdvdGlvYXB3eHVlbGVoc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Nzg0OTQsImV4cCI6MjA3MTE1NDQ5NH0._qoXGjLk2SWpoV-VnTKkTicZiOEEs84HZ5QFrTiSAWU';
  
  // Rapid fire requests to test rate limiting
  for (let i = 0; i < 20; i++) {
    const payload = JSON.stringify({
      query: `Budget guard test query ${i}`,
      user_id: '11111111-1111-1111-1111-111111111111',
    });
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
    };
    
    const response = http.post(`${baseUrl}/islamic-chatbot`, payload, params);
    
    // Should eventually hit rate limits
    if (response.status === 429) {
      console.log(`Rate limiting triggered after ${i + 1} requests`);
      break;
    }
    
    sleep(0.1); // Very short delay
  }
}