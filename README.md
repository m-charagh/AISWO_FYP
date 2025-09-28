# Smart Bin Monitoring System

A modern, Apple-inspired web application for real-time monitoring of smart waste collection bins with intelligent alerts and analytics.

## 🌟 Features

### Frontend (React)
- **Apple-inspired Design**: Modern UI with green gradients, cards, shadows, and smooth animations
- **Real-time Monitoring**: Live updates every 30 seconds with manual refresh capability
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Interactive Dashboard**: Detailed analytics with beautiful charts and data visualization
- **Smart Notifications**: Visual indicators for bin status (Normal, Warning, Full)
- **Navigation**: Sticky header with live statistics and smooth page transitions

### Backend (Express.js)
- **RESTful API**: Clean endpoints for bin data, history, and statistics
- **Firebase Integration**: Real-time database connectivity
- **Email Alerts**: Automated notifications when bins are full
- **Push Notifications**: FCM integration for mobile alerts
- **Health Monitoring**: System status and uptime tracking
- **Statistics API**: Comprehensive analytics and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Realtime Database
- Gmail account for email notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aiswo-fyp
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd aiswo_frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../aiswo-backend
   npm install
   ```

4. **Configure Firebase**
   - Place your Firebase service account key as `serviceAccountKey.json` in the backend directory
   - Update Firebase configuration in `aiswo_frontend/src/fcm.js`

5. **Configure Email Settings**
   - Update email credentials in `aiswo-backend/server.js`
   - Replace the Gmail credentials with your own

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd aiswo-backend
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd aiswo_frontend
   npm start
   ```
   Application will open at `http://localhost:3000`

## 📱 User Interface

### Design System
- **Color Palette**: Green-based theme with Apple-inspired aesthetics
- **Typography**: San Francisco font stack for optimal readability
- **Components**: Reusable cards, buttons, and status indicators
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

### Key Pages
1. **Dashboard**: Overview of all bins with statistics
2. **Bin Details**: Individual bin monitoring with charts and history
3. **404 Page**: User-friendly error handling

## 🔧 API Endpoints

### Backend Routes
- `GET /health` - System health check
- `GET /bins` - Get all bins data
- `GET /bins/:id` - Get specific bin data
- `GET /bins/:id/history` - Get bin historical data
- `GET /stats` - Get system statistics

### Example API Response
```json
{
  "bin1": {
    "weightKg": 15,
    "fillPct": 75,
    "status": "Warning",
    "updatedAt": "2025-01-20T10:30:00.000Z",
    "lastFetched": "2025-01-20T10:35:00.000Z"
  }
}
```

## 🎨 Design Features

### Apple-Inspired Elements
- **Gradients**: Subtle green gradients throughout the interface
- **Cards**: Elevated cards with soft shadows and rounded corners
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using CSS custom properties
- **Animations**: Smooth transitions and micro-interactions
- **Colors**: Green (#34C759), Light Green (#D4F4DD), White (#FFFFFF)

### Interactive Components
- **Hover Effects**: Cards lift on hover with enhanced shadows
- **Status Indicators**: Color-coded status badges with icons
- **Progress Bars**: Animated progress bars with shimmer effects
- **Buttons**: Gradient buttons with hover animations
- **Charts**: Beautiful data visualization with Chart.js

## 📊 Monitoring Features

### Real-time Updates
- Automatic refresh every 30 seconds
- Manual refresh button with loading states
- Live statistics in navigation header
- Real-time status indicators

### Alert System
- **Normal**: Green indicator (≤60% full)
- **Warning**: Orange indicator (61-80% full)
- **Full**: Red indicator (>80% full)
- Email notifications for full bins
- Push notifications via FCM

### Analytics
- Historical data visualization
- Weight and fill level trends
- System statistics and reporting
- Export capabilities (future enhancement)

## 🔒 Security & Performance

### Security Features
- CORS configuration for API access
- Input validation and sanitization
- Error handling and logging
- Secure Firebase integration

### Performance Optimizations
- Efficient data fetching with caching
- Responsive image loading
- Optimized bundle size
- Lazy loading for better performance

## 🛠️ Development

### Project Structure
```
aiswo-fyp/
├── aiswo_frontend/          # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/         # CSS and styling
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── aiswo-backend/          # Express backend
│   ├── server.js           # Main server file
│   └── serviceAccountKey.json
└── README.md               # Project documentation
```

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🚀 Deployment

### Frontend Deployment
1. Build the production version:
   ```bash
   cd aiswo_frontend
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

### Backend Deployment
1. Set up environment variables for production
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Update CORS settings for production domain

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] IoT device integration
- [ ] Machine learning predictions
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Data export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: React, CSS3, Chart.js
- **Backend Development**: Node.js, Express.js, Firebase
- **UI/UX Design**: Apple-inspired design system
- **IoT Integration**: Firebase Realtime Database

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a Final Year Project (FYP) for smart waste management system with modern web technologies and Apple-inspired design principles.
