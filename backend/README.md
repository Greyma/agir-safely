# Agir Safely Backend

Express.js backend with JWT authentication for the Agir Safely mobile app.

## Features

- 🔐 JWT Authentication (Login/Register/Logout)
- 🔒 Protected Routes
- 🛡️ Password Hashing with bcrypt
- 🌐 CORS enabled for mobile app
- 📝 User Profile Management

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env file in backend directory
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/auth/logout`
Logout (optional - JWT is stateless).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Protected Routes

#### GET `/api/profile`
Get user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET `/api/protected`
Example protected route.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "This is a protected route",
  "user": {
    "userId": "123",
    "email": "user@example.com"
  }
}
```

## Test Credentials

For testing purposes, a default user is included:

- **Email:** `test@example.com`
- **Password:** `password`

## Security Notes

1. **JWT Secret**: Change the JWT_SECRET in production
2. **Password Hashing**: Passwords are hashed using bcrypt
3. **CORS**: Configured for mobile app access
4. **Token Expiration**: JWT tokens expire in 24 hours

## Development

### File Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # This file
```

### Adding New Routes

1. Create route handlers in `server.js`
2. Use `authenticateToken` middleware for protected routes
3. Follow the existing pattern for error handling

### Database Integration

Currently using in-memory storage. To add a database:

1. Install database driver (e.g., `pg` for PostgreSQL)
2. Create database models
3. Replace in-memory arrays with database queries
4. Add connection pooling for production

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Add rate limiting
5. Use HTTPS
6. Set up proper logging
7. Add database connection
8. Configure environment variables

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in .env file
2. **CORS errors**: Check CORS configuration for your domain
3. **JWT errors**: Verify JWT_SECRET is set correctly
4. **Connection refused**: Ensure server is running on correct port

### Logs

The server logs important information:
- Server startup details
- Authentication attempts
- API errors
- JWT verification failures 