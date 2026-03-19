// src/services/authService.js
import API_BASE_URL_CONFIG from '../config';
const API_BASE_URL = `${API_BASE_URL_CONFIG}/api`;

class AuthService {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  // Set up axios-like request with token
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add token to requests
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async getProfile() {
    try {
      return await this.request('/auth/profile');
    } catch (error) {
      // Token might be expired
      if (error.message.includes('token') || error.message.includes('Unauthorized')) {
        this.logout();
      }
      throw error;
    }
  }

  // Quiz methods
  async submitQuiz(quizData, styleProfile) {
    try {
      return await this.request('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ quizData, styleProfile })
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to submit quiz');
    }
  }

  async getQuizRecommendations(requestData) {
    try {
      return await this.request('/quiz/recommendations', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to get recommendations');
    }
  }

  // Favorites methods
  async getFavorites() {
    try {
      return await this.request('/favorites');
    } catch (error) {
      throw new Error(error.message || 'Failed to get favorites');
    }
  }

  async addToFavorites(productData) {
    try {
      return await this.request('/favorites', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to add to favorites');
    }
  }

  async removeFromFavorites(productId) {
    try {
      return await this.request(`/favorites/${productId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to remove from favorites');
    }
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('access_token');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Store user data locally
  setUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  getUserData() {
    try {
      const data = localStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;