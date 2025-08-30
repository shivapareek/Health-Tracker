import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, Activity, Moon, Utensils, TrendingUp, Plus, BarChart3, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const healthAPI = {
  async getAllHealthData(days = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/health?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch health data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health data:', error);
      // Fallback to simulated data if backend not available
      return this.generateSampleData();
    }
  },

  async addHealthEntry(type, value, date) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, date }),
      });
      if (!response.ok) throw new Error('Failed to add health entry');
      return await response.json();
    } catch (error) {
      console.error('Error adding health entry:', error);
      throw error;
    }
  },

  generateSampleData() {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      last7Days.push({
        date: dateStr,
        calories: Math.floor(Math.random() * 500) + 1800,
        sleep: Math.floor(Math.random() * 3) + 6,
        workouts: Math.floor(Math.random() * 2),
        weight: Math.floor(Math.random() * 5) + 70,
        steps: Math.floor(Math.random() * 5000) + 5000
      });
    }
    
    return {
      calories: last7Days.map(d => ({ date: d.date, value: d.calories })),
      sleep: last7Days.map(d => ({ date: d.date, value: d.sleep })),
      workouts: last7Days.map(d => ({ date: d.date, value: d.workouts })),
      weight: last7Days.map(d => ({ date: d.date, value: d.weight })),
      steps: last7Days.map(d => ({ date: d.date, value: d.steps }))
    };
  }
};

const HealthTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthData, setHealthData] = useState({
    calories: [],
    sleep: [],
    workouts: [],
    weight: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setLoading(true);
        const data = await healthAPI.getAllHealthData();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load health data. Using sample data.');
        // Use sample data as fallback
        const sampleData = healthAPI.generateSampleData();
        setHealthData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  const [newEntry, setNewEntry] = useState({
    type: 'calories',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  const addHealthEntry = async () => {
    if (!newEntry.value) return;
    
    try {
      setLoading(true);
      await healthAPI.addHealthEntry(newEntry.type, newEntry.value, newEntry.date);
      

      const updatedData = await healthAPI.getAllHealthData();
      setHealthData(updatedData);
      
      setNewEntry({ ...newEntry, value: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add entry. Please try again.');

      const entry = {
        date: newEntry.date,
        value: parseFloat(newEntry.value)
      };

      setHealthData(prev => ({
        ...prev,
        [newEntry.type]: [...prev[newEntry.type], entry].slice(-7)
      }));

      setNewEntry({ ...newEntry, value: '' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayCalories = healthData.calories.find(d => d.date === today)?.value || 0;
    const todaySleep = healthData.sleep.find(d => d.date === today)?.value || 0;
    const todayWorkouts = healthData.workouts.find(d => d.date === today)?.value || 0;
    const todayWeight = healthData.weight.find(d => d.date === today)?.value || 0;

    return { todayCalories, todaySleep, todayWorkouts, todayWeight };
  };

  const stats = getCurrentStats();

  const workoutTypes = [
    { name: 'Cardio', value: 40, color: '#8884d8' },
    { name: 'Strength', value: 35, color: '#82ca9d' },
    { name: 'Yoga', value: 15, color: '#ffc658' },
    { name: 'Other', value: 10, color: '#ff7300' }
  ];

  const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value} <span className="text-sm font-normal text-gray-500">{unit}</span></p>
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Health Tracker</h1>
            </div>
            <nav className="flex space-x-8">
              {['dashboard', 'add', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading health data...</span>
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Today's Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Calories"
                value={stats.todayCalories}
                unit="kcal"
                icon={Utensils}
                color="#f59e0b"
              />
              <StatCard
                title="Sleep"
                value={stats.todaySleep}
                unit="hours"
                icon={Moon}
                color="#8b5cf6"
              />
              <StatCard
                title="Workouts"
                value={stats.todayWorkouts}
                unit="sessions"
                icon={Activity}
                color="#06b6d4"
              />
              <StatCard
                title="Weight"
                value={stats.todayWeight}
                unit="kg"
                icon={TrendingUp}
                color="#10b981"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Calories</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={healthData.calories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Pattern</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={healthData.sleep}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Add Entry Tab */}
        {activeTab === 'add' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Add Health Entry</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="calories">Calories</option>
                    <option value="sleep">Sleep (hours)</option>
                    <option value="workouts">Workouts</option>
                    <option value="weight">Weight (kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={newEntry.value}
                    onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter value"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={addHealthEntry}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </button>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setNewEntry({ ...newEntry, type: 'workouts', value: '1' })}
                className="bg-cyan-600 text-white p-4 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Activity className="h-6 w-6 mx-auto mb-2" />
                Quick Workout
              </button>
              <button
                onClick={() => setNewEntry({ ...newEntry, type: 'sleep', value: '8' })}
                className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Moon className="h-6 w-6 mx-auto mb-2" />
                8hrs Sleep
              </button>
              <button
                onClick={() => setNewEntry({ ...newEntry, type: 'calories', value: '2000' })}
                className="bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Utensils className="h-6 w-6 mx-auto mb-2" />
                2000 Calories
              </button>
              <button
                onClick={() => setNewEntry({ ...newEntry, type: 'weight', value: '70' })}
                className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                Weight Check
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Health Reports</h2>
            
            {/* Summary Stats */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.round(healthData.calories.reduce((sum, item) => sum + item.value, 0) / healthData.calories.length) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg Calories/Day</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((healthData.sleep.reduce((sum, item) => sum + item.value, 0) / healthData.sleep.length) * 10) / 10 || 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg Sleep/Night</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-600">
                    {healthData.workouts.reduce((sum, item) => sum + item.value, 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {healthData.weight.length > 1 ? 
                      (healthData.weight[healthData.weight.length - 1].value - healthData.weight[0].value > 0 ? '+' : '') +
                      (healthData.weight[healthData.weight.length - 1].value - healthData.weight[0].value).toFixed(1)
                      : '0'
                    }
                  </p>
                  <p className="text-sm text-gray-600">Weight Change (kg)</p>
                </div>
              </div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calories Trend */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorie Intake Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthData.calories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [value + ' kcal', 'Calories']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sleep Quality */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Duration</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={healthData.sleep}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [value + ' hours', 'Sleep']}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Workout Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Types Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={workoutTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {workoutTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value + '%', 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Weight Progress */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthData.weight}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [value + ' kg', 'Weight']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Goals Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Calories Goal</span>
                    <span>{stats.todayCalories}/2000 kcal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((stats.todayCalories / 2000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Sleep Goal</span>
                    <span>{stats.todaySleep}/8 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((stats.todaySleep / 8) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Workout Goal</span>
                    <span>{stats.todayWorkouts}/1 sessions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cyan-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((stats.todayWorkouts / 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthTracker;