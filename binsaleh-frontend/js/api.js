/* =========================================================================
   api.js — BIN SALEH Store Frontend <-> Backend Bridge
   -------------------------------------------------------------------------
   Har HTML page mein ye script sabse pehle include karo (tracking.js se
   pehle), taake API_BASE aur helper functions available hon:

     <script src="./js/api.js"></script>

   Local testing ke dauran API_BASE localhost hai. Jab backend deploy
   (Render/Railway) ho jaye, neeche wali line update kar dena.
   ========================================================================= */

/* -----------------------------------------------------------------
   API BASE URL
   Auto-detection: If deployed on Netlify (production), it uses the Render
   backend URL. If running locally, it uses localhost.
   
   Override by setting:  window.BACKEND_URL = "https://your-api.com/api";
   before this script loads.
------------------------------------------------------------------ */
const API_BASE = (function() {
  // Allow manual override via window variable
  if (window.BACKEND_URL) return window.BACKEND_URL;

  var host = window.location.hostname;
  var protocol = window.location.protocol;

  // ----------------------------------------------------------------
  // RENDER BACKEND — production Express + MongoDB API
  // Deploy your Express backend to Render: https://binsaleh-api.onrender.com
  // Get the actual URL from Render dashboard after deployment.
  // Override via window.BACKEND_URL if needed.
  // ----------------------------------------------------------------
  var RENDER_API = 'https://binsaleh-api.onrender.com/api';

  // Local development (localhost, 127.0.0.1, or file:// protocol)
  // Use the Render API by default (it's already deployed and working),
  // or switch to a local backend if you're running one.
  if (host === 'localhost' || host === '127.0.0.1' || protocol === 'file:') {
    // Uncomment the line below to use a local backend (Express running on port 5000):
    // return 'http://localhost:5000/api';
    return RENDER_API;
  }

  // Production (Netlify, custom domain, etc.)
  // Use the Render backend — this is our primary API
  return RENDER_API;
})();

/* -----------------------------------------------------------------
   TOKEN HELPERS
   User login karega to JWT token yahan save hoga (localStorage mein
   sirf token — asal user data ab backend/DB mein hai).
------------------------------------------------------------------ */
function getToken() {
  return localStorage.getItem('bs_token');
}
function setToken(token) {
  localStorage.setItem('bs_token', token);
}
function clearToken() {
  localStorage.removeItem('bs_token');
}

/* -----------------------------------------------------------------
   GENERIC API CALLER
   Sab fetch() calls isi function se guzrenge — error handling
   aur auth header automatically laga dete hain.
------------------------------------------------------------------ */
// async function apiRequest(endpoint, options = {}) {
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(options.headers || {})
//   };

//   const token = getToken();
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const res = await fetch(`${API_BASE}${endpoint}`, {
//     ...options,
//     headers
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(data.message || `Request failed (${res.status})`);
//   }

//   return data;
// }
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

/* -----------------------------------------------------------------
   SHORTHAND METHODS
------------------------------------------------------------------ */
const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  del: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  // Upload a file (multipart/form-data) — returns { url, public_id }
  uploadFile: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(API_BASE + '/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
  // Upload an image from URL
  uploadFromUrl: async (url) => {
    return api.post('/upload/url', { url });
  }
};
