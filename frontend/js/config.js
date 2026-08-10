/**
 * KrishiSetu API Configuration
 *
 * Local development:
 *   http://localhost:5000/api
 *
 * Production:
 *   Netlify frontend -> Render Flask backend
 */

function getApiBaseUrl() {
  // Local development
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'http://localhost:5000/api';
  }

  // Optional runtime override for testing/admin configuration.
  if (window.KRISHISETU_API_URL) {
    return window.KRISHISETU_API_URL.replace(/\/$/, '');
  }

  const storedUrl = localStorage.getItem('api_base_url');
  if (storedUrl) {
    return storedUrl.replace(/\/$/, '');
  }

  // Production Render backend.
  // If Render gives your service a different URL, change this one line.
  return 'https://krishisetu-backend.onrender.com/api';
}

const API_BASE_URL = getApiBaseUrl();

window.API_BASE_URL = API_BASE_URL;

window.setApiBaseUrl = function (url) {
  const normalized = String(url || '').replace(/\/$/, '');
  localStorage.setItem('api_base_url', normalized);
  location.reload();
};

console.log('KrishiSetu API Base URL:', API_BASE_URL);
