// client/src/services/authService.js

import axios from 'axios';

const API_URL = '/api/auth/';

export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('An unexpected error occurred. Please check your connection and try again.');
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('An unexpected error occurred during registration.');
    }
  }
};

// Aliases so both import styles work seamlessly
export const loginUser = login;
export const registerUser = register;

export default { login, register, loginUser, registerUser };