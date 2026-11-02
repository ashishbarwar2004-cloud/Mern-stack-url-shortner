import axios from 'axios';

export const apiService = {
  shortenUrl: async ({ longUrl }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post('/api/shorten', { longUrl }, { headers });
      return response.data;
    } catch (error) {
      console.error('Shorten URL error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(error.message || 'Failed to shorten URL. Make sure the backend server is running.');
    }
  },
};

export default apiService;
