const API_BASE_URL = 'http://localhost:5000/api';

class HealthAPI {
  async getAllHealthData(days = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/health?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch health data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health data:', error);
      throw error;
    }
  }

  async getHealthDataByType(type, days = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/health/${type}?days=${days}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      throw error;
    }
  }

  async addHealthEntry(type, value, date) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, value, date }),
      });
      
      if (!response.ok) throw new Error('Failed to add health entry');
      return await response.json();
    } catch (error) {
      console.error('Error adding health entry:', error);
      throw error;
    }
  }

  async updateHealthEntry(id, type, value, date) {
    try {
      const response = await fetch(`${API_BASE_URL}/health/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, value, date }),
      });
      
      if (!response.ok) throw new Error('Failed to update health entry');
      return await response.json();
    } catch (error) {
      console.error('Error updating health entry:', error);
      throw error;
    }
  }

  async deleteHealthEntry(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/health/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete health entry');
      return await response.json();
    } catch (error) {
      console.error('Error deleting health entry:', error);
      throw error;
    }
  }

  async getHealthStats(days = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/health/stats/summary?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch health stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health stats:', error);
      throw error;
    }
  }
}

export default new HealthAPI();