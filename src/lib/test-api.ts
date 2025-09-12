// Simple working chat API test
export const testChatAPI = async (message: string): Promise<string> => {
  try {
    console.log('Testing API with message:', message);
    
    const response = await fetch('http://localhost:8002/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    return data.response || 'No response from API';
  } catch (error) {
    console.error('API Error:', error);
    return `Error: ${error.message}`;
  }
};

// Test function to call from browser console
(window as any).testChat = testChatAPI;