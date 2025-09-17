# LifeHub - Health & Wellness Tracking Platform

A full-stack web application for comprehensive health and wellness tracking, featuring nutrition logging, fitness monitoring, mood tracking, and analytics dashboard.

## Live Demo

You can try the deployed version of LifeHub here:
👉 https://lifehub-three.vercel.app/

## Features

### Core Functionality
- **Nutrition Tracking**: Food logging with calorie and macro tracking
- **Water Intake Monitoring**: Daily hydration tracking with visual progress
- **Exercise Logging**: Workout sessions with duration and calorie burn tracking
- **Mood Tracking**: Daily mood logging with notes and trend analysis
- **Analytics Dashboard**: Comprehensive charts and data visualization
- **User Authentication**: Secure login and registration system
- **Data Persistence**: Local storage with user-specific data isolation

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Updates**: Dynamic data visualization and dashboard updates
- **Data Export**: User data management and export capabilities
- **Security**: Password hashing and secure authentication
- **Cross-platform**: Works on desktop and mobile browsers

## Architecture

```
LifeHub/
├── frontend/         # HTML/CSS/JavaScript application
├── backend/          # Node.js/Express API server
├── vercel.json       # Deployment configuration
└── README.md         # Project documentation
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Tailwind CSS framework
- **JavaScript**: Vanilla JS with ES6+ features
- **Canvas API**: Custom chart rendering for analytics
- **Local Storage**: Client-side data persistence

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **Crypto**: Password hashing and security
- **RESTful API**: Standard HTTP endpoints

### Deployment
- **Vercel**: Static site hosting and deployment
- **GitHub**: Version control and CI/CD
- **Docker**: Containerization support

## Quick Start

### Prerequisites
- Node.js 18+
- Modern web browser
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/lsb40/LifeHub.git
cd LifeHub
```

2. **Start the backend server**
```bash
cd backend
npm install
node simple-server.js
```

3. **Start the frontend server**
```bash
cd frontend
python3 -m http.server 3001
```

4. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Data Management
- `POST /api/v1/nutrition/log` - Log nutrition data
- `POST /api/v1/water/log` - Log water intake
- `POST /api/v1/exercise/log` - Log exercise data
- `POST /api/v1/mood/log` - Log mood data

### Health Check
- `GET /api/v1/health` - API health status

## Development

### Project Structure
- **Frontend**: Single-page application with modular JavaScript
- **Backend**: RESTful API with middleware and error handling
- **Data Flow**: Client-side storage with API synchronization
- **Security**: Password hashing and input validation

### Key Components
- **Authentication System**: JWT-based user management
- **Data Models**: Structured data handling for all health metrics
- **Chart Generation**: Custom canvas-based analytics visualization
- **Responsive UI**: Mobile-optimized interface design

## Testing

The application includes:
- **Manual Testing**: Comprehensive user flow testing
- **Cross-browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Mobile Responsiveness**: iOS and Android browser testing
- **Data Validation**: Input sanitization and error handling

## Security

- **Password Hashing**: SHA-256 encryption for user passwords
- **Input Validation**: Client and server-side data validation
- **CORS Configuration**: Secure cross-origin requests
- **Data Isolation**: User-specific data storage and access

## Performance

- **Optimized Loading**: Minimal dependencies and efficient code
- **Responsive Design**: Fast rendering across all devices
- **Data Caching**: Local storage for improved performance
- **Chart Rendering**: Efficient canvas-based data visualization

## Future Enhancements

- **Database Integration**: PostgreSQL for production data storage
- **Real-time Sync**: Cloud-based data synchronization
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Machine learning insights and recommendations
- **Social Features**: Community challenges and sharing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**LifeHub** - Comprehensive health and wellness tracking for modern lifestyles.