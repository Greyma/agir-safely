# MongoDB Setup for Agir Safely Backend

This guide will help you set up MongoDB for your Agir Safely application.

## Prerequisites

1. **MongoDB Installation**
   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

2. **Node.js and npm**
   - Make sure you have Node.js installed (version 14 or higher)

## Setup Instructions

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Server**
   ```bash
   # Windows: Download from mongodb.com and run installer
   # macOS: brew install mongodb-community
   # Ubuntu: sudo apt install mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows: MongoDB runs as a service automatically
   # macOS: brew services start mongodb-community
   # Ubuntu: sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose "Free" tier
   - Select your preferred cloud provider and region
   - Create cluster

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agir-safely
   ```

## Environment Configuration

1. **Create .env file** (if not already created)
   ```bash
   cd backend
   ```

2. **Configure environment variables**
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/agir-safely
   # For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agir-safely

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Server Port
   PORT=5000

   # Environment
   NODE_ENV=development
   ```

## Database Models

The application includes the following MongoDB models:

### 1. User Model
- Authentication and user management
- Password hashing with bcrypt
- Role-based access control

### 2. Accident Model
- Accident reporting and tracking
- Severity levels and types
- Witness information and actions taken

### 3. PPE Model (Personal Protective Equipment)
- Equipment inventory management
- Assignment tracking
- Maintenance schedules

### 4. Chemical Product Model
- Chemical inventory management
- Safety data sheets
- Hazard classification

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /api/profile` - Get user profile

### Accidents
- `GET /api/accidents` - Get all accidents
- `POST /api/accidents` - Create new accident
- `GET /api/accidents/:id` - Get accident by ID
- `PUT /api/accidents/:id` - Update accident

### PPE
- `GET /api/ppe` - Get all PPE
- `POST /api/ppe` - Create new PPE
- `GET /api/ppe/:id` - Get PPE by ID

### Chemical Products
- `GET /api/chemicals` - Get all chemical products
- `POST /api/chemicals` - Create new chemical product
- `GET /api/chemicals/:id` - Get chemical product by ID

## Running the Application

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

3. **Seed the database** (optional)
   ```bash
   node seed.js
   ```

## Testing the API

### Test User Credentials (after seeding)
- **Admin User**: john@example.com / password123
- **Manager User**: jane@example.com / password123
- **Regular User**: bob@example.com / password123

### Example API Calls

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:5000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Get accidents (with token)**
   ```bash
   curl -X GET http://localhost:5000/api/accidents \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Database Management

### MongoDB Compass (GUI)
- Download MongoDB Compass for a visual database interface
- Connect to your MongoDB instance
- Browse and manage collections

### Command Line
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use agir-safely

# Show collections
show collections

# Query documents
db.users.find()
db.accidents.find()
db.ppe.find()
db.chemicalproducts.find()
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Make sure MongoDB service is running
   - Check if port 27017 is available
   - Verify connection string in .env

2. **Authentication Failed**
   - Check username/password in connection string
   - Ensure user has proper permissions

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check if all required packages are in package.json

### Logs
- Check server console for error messages
- MongoDB logs are usually in `/var/log/mongodb/` (Linux) or MongoDB installation directory (Windows)

## Security Considerations

1. **Change default JWT secret** in production
2. **Use strong passwords** for MongoDB users
3. **Enable authentication** in MongoDB
4. **Use HTTPS** in production
5. **Implement rate limiting**
6. **Validate all inputs**

## Production Deployment

1. **Use MongoDB Atlas** for cloud hosting
2. **Set up proper environment variables**
3. **Enable MongoDB authentication**
4. **Use strong JWT secrets**
5. **Implement proper logging**
6. **Set up monitoring and backups**

## Support

For issues related to:
- **MongoDB**: Check [MongoDB documentation](https://docs.mongodb.com/)
- **Mongoose**: Check [Mongoose documentation](https://mongoosejs.com/)
- **Application**: Check the main README.md file 