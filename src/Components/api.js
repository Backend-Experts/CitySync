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
  console.log('Final data being sent:', JSON.stringify(data, null, 2));
  try {
    console.log('Submitting data to:', url);
    console.log('Request payload:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Explicitly ask for JSON response
      },
      body: JSON.stringify({ data }), // Wrap in object for extra safety
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON response:', jsonResponse);
      return jsonResponse;
    } catch (e) {
      console.log('Response was not JSON:', responseText);
      return { text: responseText };
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
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