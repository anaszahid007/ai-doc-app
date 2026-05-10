const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - clear auth state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('current_doc_id');
        // Reload to trigger auth redirect
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    const error = await response.json().catch(() => ({ detail: 'Something went wrong' }));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

export const authApi = {
  signup: (data: any) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const docApi = {
  upload: (file: File) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('current_doc_id');
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || 'Upload failed');
      }
      return res.json();
    });
  },
};

export const convApi = {
  list: () => apiRequest('/conversations/'),
  create: (data: any) => apiRequest('/conversations/', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (id: string) => apiRequest(`/conversations/${id}/messages`),
};
