# StoreTrack - Inventory Management System

A modern, full-stack inventory management system built with Node.js, Express, MongoDB, and Next.js.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Staff)
  - Secure password hashing with bcrypt

- **Inventory Management**
  - Add, edit, and delete items
  - Track stock quantities
  - Category-based organization
  - Low stock alerts
  - Stock history tracking

- **Order Management**
  - Create and manage orders
  - Order status tracking (Waiting/Sent/Canceled)
  - Automatic stock updates
  - Order history

- **Dashboard & Reports**
  - Real-time statistics
  - Low stock alerts
  - Recent orders overview
  - Comprehensive reporting

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Swagger** - API documentation

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zustand** - State management
- **Heroicons** - Icons

## Prerequisites

- Node.js 20+
- MongoDB 6+
- npm or yarn
- Docker (optional)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/storetrack.git
cd storetrack
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start with Docker Compose:
```bash
docker compose up -d --build
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

### Manual Installation

#### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/storetrack
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
LOW_STOCK_THRESHOLD=5
```

3. Start MongoDB:
```bash
mongod
```

4. Run the backend:
```bash
npm start
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the frontend:
```bash
npm run dev
```

## API Documentation

Once the backend is running, API documentation is available at:
```
http://localhost:3000/api-docs
```

## Default Users

The system comes with two default users:

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| Staff | staff    | staff123  |

## Project Structure

```
StoreTrack/
├── src/                    # Backend source code
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # API client
│   │   ├── store/        # State management
│   │   ├── styles/       # Global styles
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Backend Docker image
└── README.md           # This file
```

## Features by Role

### Admin
- Full access to all features
- User management
- Item management (CRUD)
- Order management
- View reports and analytics
- System settings

### Staff
- View items
- Create and view orders
- View dashboard
- Limited report access

## Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `LOW_STOCK_THRESHOLD` - Threshold for low stock alerts

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/register` - Register new user (role required)

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (Admin only)
- `PUT /api/items/:id` - Update item (Admin only)
- `DELETE /api/items/:id` - Delete item (Admin only)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `DELETE /api/orders/:id` - Delete order (Admin only)

### Stock History
- `GET /api/stock-history` - Get stock change records
- `GET /api/stock-history/:id` - Get single stock record

### Reports
- `GET /api/reports/low-stock` - Get items below threshold
- `GET /api/reports/sales` - Get sales summary by date range

## Testing

### Backend API Testing
You can test the API endpoints using:
- Swagger UI at `/api-docs`
- Postman or similar API testing tools
- cURL commands

Example with cURL:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get items (with token)
curl http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Testing
Access the application at `http://localhost:3001` and login with the default credentials.

## Deployment

### Docker Deployment

1. Build and run containers:
```bash
docker compose up -d --build
```

2. Stop containers:
```bash
docker compose down
```

3. View logs:
```bash
docker compose logs -f
```

4. Remove containers and volumes:
```bash
docker compose down -v
```

### Manual Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Set NODE_ENV to production:
```bash
export NODE_ENV=production
```

3. Start services:
```bash
npm start
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For Docker: use `mongodb://mongo:27017/storetrack`
- For local: use `mongodb://localhost:27017/storetrack`

### Port Already in Use
- Change ports in .env or docker-compose.yml
- Kill processes using the ports:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker Issues
- Ensure Docker daemon is running
- Clear Docker cache: `docker system prune -a`
- Rebuild containers: `docker compose build --no-cache`

### Frontend Build Errors
- Clear Next.js cache: `rm -rf frontend/.next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with modern web technologies
- Designed for scalability and maintainability
- Follows best practices for security and performance