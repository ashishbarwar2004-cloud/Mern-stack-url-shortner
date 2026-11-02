import axios from 'axios';

export const getUserLinks = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/links', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get user links error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to fetch links. Please try again.');
  }
};
