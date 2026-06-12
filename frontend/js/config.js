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
  if (window.KRISHISETU_API_URL) {
    return window.KRISHISETU_API_URL.replace(/\/$/, '');
  }
  
  // Get from localStorage if user has set it
  const storedUrl = localStorage.getItem('api_base_url');
  if (storedUrl) {
    return storedUrl.replace(/\/$/, '');
  }

  // Default Render backend created from render.yaml.
  // If Render gives you a different service URL, run:
  // localStorage.setItem('api_base_url', 'https://your-render-url.onrender.com/api')
  return 'https://krishisetu-backend.onrender.com/api';
}

// Make it globally available
const API_BASE_URL = getApiBaseUrl();
window.API_BASE_URL = API_BASE_URL;

// Function to update API URL at runtime if needed
window.setApiBaseUrl = function(url) {
  localStorage.setItem('api_base_url', url);
  location.reload();
};

// Log current API base URL (for debugging)
console.log('API Base URL:', API_BASE_URL);
