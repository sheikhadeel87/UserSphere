const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 
      'Content-Type': 'application/json', 
      ...getAuthHeader(),
      ...(options.headers || {}) 
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const usersApi = {
  getUsers(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/users?${query.toString()}`);
  },
  createUser(payload) {
    return request('/users', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateUser(id, payload) {
    return request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteUser(id) {
    return request(`/users/${id}`, { method: 'DELETE' });
  },
  getStats() {
    return request('/users/stats');
  }
};

export const getPredictions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/users/predictions${query ? `?${query}` : ''}`, {
    headers: getAuthHeader()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch predictions');
  return data;
};
