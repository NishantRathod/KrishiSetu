/**
 * KrishiSetu Configuration
 * Sets the API base URL based on environment
 */

// Determine API base URL based on current domain
function getApiBaseUrl() {
  // If running locally
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production: Check for environment variable or use deployed backend URL
  // This can be set via Netlify environment variables
  if (typeof KRISHISETU_API_URL !== 'undefined') {
    return KRISHISETU_API_URL;
  }
  
  // Get from localStorage if user has set it
  const storedUrl = localStorage.getItem('api_base_url');
  if (storedUrl) {
    return storedUrl;
  }
  
  // Default to current domain (assumes backend is on same domain)
  // For Netlify with separate backend, update this or set KRISHISETU_API_URL environment variable
  return `${window.location.origin}/api`;
}

// Make it globally available
const API_BASE_URL = getApiBaseUrl();

// Function to update API URL at runtime if needed
window.setApiBaseUrl = function(url) {
  localStorage.setItem('api_base_url', url);
  location.reload();
};

// Log current API base URL (for debugging)
console.log('API Base URL:', API_BASE_URL);
