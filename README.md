# 🏥 Health Tracker App

A comprehensive full-stack health monitoring application built with React, Node.js, MongoDB, and Chart.js. Track your daily calories, sleep patterns, workouts, and weight with beautiful data visualizations and detailed reports.

![Health Tracker Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)

## ✨ Features

### 📊 Dashboard
- **Real-time Health Overview** - Today's calories, sleep, workouts, and weight at a glance
- **Interactive Charts** - Weekly trends with Chart.js visualizations
- **Progress Tracking** - Daily goal progress bars with percentage completion
- **Statistics Cards** - Beautiful stat cards with icons and color coding

### 📝 Data Entry
- **Quick Add Forms** - Simple forms for manual data entry
- **Smart Date Selection** - Easy date picker for historical entries
- **Quick Action Buttons** - One-click entry for common values
- **Data Validation** - Input validation and error handling

### 📈 Reports & Analytics
- **Weekly Summaries** - Comprehensive weekly health statistics
- **Trend Analysis** - Line charts for calories and weight progression
- **Sleep Patterns** - Bar charts showing sleep duration trends
- **Workout Distribution** - Pie charts for workout type analysis
- **Goal Achievement** - Progress tracking with visual indicators

## 🛠️ Technology Stack

- **Frontend**: React 18, Recharts (Chart.js), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, RESTful APIs
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Ready for Heroku, Vercel, or Docker

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shivapareek/health-tracker.git
cd health-tracker
```

2. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install


# Start MongoDB service
mongod

# Run backend server
npm run dev
```

3. **Frontend Setup**
```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start React development server
npm run dev
```

4. **Environment Configuration**

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthtracker
```

## 📱 Usage

### Adding Health Data
1. Navigate to the **Add** tab
2. Select data type (Calories, Sleep, Workouts, Weight)
3. Enter value and select date
4. Click "Add Entry" or use quick action buttons

### Viewing Reports
1. Go to **Reports** tab for detailed analytics
2. View weekly summaries and trends
3. Analyze workout distribution and goal progress
4. Export data for external analysis

### Dashboard Overview
- Monitor today's health metrics
- Track weekly progress with interactive charts
- View goal completion status
- Quick access to recent entries

## 🔧 API Endpoints

### Health Data Management
```http
GET    /api/health              # Get all health data
GET    /api/health/:type        # Get data by type (calories, sleep, etc.)
POST   /api/health              # Add new health entry
PUT    /api/health/:id          # Update existing entry
DELETE /api/health/:id          # Delete health entry
```

### Statistics & Analytics
```http
GET    /api/health/stats/summary    # Get health statistics summary
GET    /api/health/debug/count      # Get total entries count
GET    /api/health/debug/latest     # Get latest 10 entries
```

### Request/Response Examples

**POST /api/health** - Add Health Entry
```json
{
  "type": "calories",
  "value": 2000,
  "date": "2025-08-31"
}
```

**Response:**
```json
{
  "_id": "66d3f8a5b4c1d2e3f4567890",
  "type": "calories",
  "value": 2000,
  "date": "2025-08-31T00:00:00.000Z",
  "userId": "default_user",
  "createdAt": "2025-08-31T10:30:00.000Z"
}
```

## 📈 Performance Optimization

### Backend Optimizations
- **Database Indexing** - Indexed queries on userId, type, and date
- **API Caching** - Redis caching for frequently accessed data
- **Query Optimization** - Aggregation pipelines for statistics
- **Compression** - Gzip compression for API responses

### Frontend Optimizations
- **Code Splitting** - Lazy loading for different app sections
- **Memoization** - React.memo for chart components
- **Debounced API Calls** - Reduced server requests
- **Optimized Re-renders** - Efficient state management

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** - Beautiful data visualizations
- **MongoDB** - Flexible document database
- **React Team** - Amazing frontend framework
- **Express.js** - Fast web framework for Node.js
- **Tailwind CSS** - Utility-first CSS framework


Made with ❤️ for health enthusiasts who love data-driven insights!
