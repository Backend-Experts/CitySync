// src/services/api.js

/**
 * Service for submitting questionnaire data to API Gateway/Lambda backend
 */

const API_BASE_URL = 'https://a2v132aquh.execute-api.us-east-1.amazonaws.com/prod';
const SUBMIT_ENDPOINT = '/submit';

/**
 * Submit questionnaire answers to the backend
 * @param {Object} data - The questionnaire data to submit
 * @returns {Promise<Response>} - The fetch response
 * @throws {Error} - If the request fails or returns an error
 */
export const callSubmitAPI = async (data) => {
  const url = `${API_BASE_URL}${SUBMIT_ENDPOINT}`;
  
  try {
    console.log('Submitting data to:', url);
    console.log('Request payload:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API keys or auth headers here
        // 'x-api-key': 'your-api-key-here'
      },
      body: JSON.stringify(data),
      credentials: 'same-origin' // or 'include' for cross-origin with credentials
    });

    console.log('Received response:', response);

    if (!response.ok) {
      // Try to get error details from response
      let errorDetails = '';
      try {
        const errorResponse = await response.json();
        errorDetails = errorResponse.message || JSON.stringify(errorResponse);
      } catch (e) {
        errorDetails = await response.text();
      }
      
      throw new Error(`API request failed with status ${response.status}: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    
    // Enhance network errors with more context
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    throw error; // Re-throw other errors
  }
};

/**
 * Test API connectivity
 * @returns {Promise<Object>} - The test response
 */
export const testAPIConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

// Utility function for debugging
export const logAPIRequest = (method, endpoint, data) => {
  console.group('API Request');
  console.log('Method:', method);
  console.log('Endpoint:', endpoint);
  console.log('Data:', data);
  console.groupEnd();
};