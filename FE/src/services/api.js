const API_BASE = 'http://localhost:8080/api';

function getHeaders() {
  const token = localStorage.getItem('nexa_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
    return data.data;
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  // Devices
  async getDevices() {
    const res = await fetch(`${API_BASE}/devices`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data || [];
  },

  async toggleDevice(deviceId) {
    const res = await fetch(`${API_BASE}/devices/${deviceId}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  // Sensors
  async getSensorSummary() {
    const res = await fetch(`${API_BASE}/sensors/summary`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  async getSensorChart(filterMode = 'last15', from = null, to = null) {
    let url = `${API_BASE}/sensors/chart?filterMode=${filterMode}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  async getSensorData({ sensorType = 'All', quickSearch = '', page = 1, size = 15, sortBy = 'time', sortDir = 'desc' } = {}) {
    let url = `${API_BASE}/sensors/data?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (sensorType && sensorType !== 'All') {
      url += `&sensorType=${encodeURIComponent(sensorType)}`;
    }
    if (quickSearch) {
      url += `&quickSearch=${encodeURIComponent(quickSearch)}`;
    }
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  // History
  async getHistory({ keyword = '', device = 'All Devices', action = 'All Actions', status = 'All Status', fromDate = null, toDate = null, page = 1, size = 10, sortBy = 'time', sortDir = 'desc' } = {}) {
    let url = `${API_BASE}/history?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (device && device !== 'All Devices') url += `&device=${encodeURIComponent(device)}`;
    if (action && action !== 'All Actions') url += `&action=${encodeURIComponent(action)}`;
    if (status && status !== 'All Status') url += `&status=${encodeURIComponent(status)}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;

    const res = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    return data.data;
  },

  async updateProfile(profile) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Cập nhật thất bại');
    }
    return data.data;
  },

  async changePassword(oldPassword, newPassword) {
    const res = await fetch(`${API_BASE}/users/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại');
    }
    return data.data;
  },
};
