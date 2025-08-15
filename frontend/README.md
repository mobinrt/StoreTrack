# StoreTrack Frontend

Modern, responsive frontend for the StoreTrack inventory management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Modern React/Next.js** with TypeScript
- 🎨 **Beautiful UI** with Tailwind CSS and Headless UI
- 📱 **Responsive Design** for all device sizes
- 🔐 **JWT Authentication** with role-based access
- 📊 **Real-time Data** with React Query
- 🎯 **State Management** with Zustand
- 🔔 **Toast Notifications** for user feedback
- 📈 **Dashboard Analytics** with charts and insights
- 🛡️ **Form Validation** with React Hook Form

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Update environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Layout components (Sidebar, Header)
│   │   └── UI/             # Base UI components (Button, Input, etc.)
│   ├── hooks/              # Custom React hooks for API calls
│   ├── lib/                # Utility libraries (API client)
│   ├── pages/              # Next.js pages
│   ├── store/              # Zustand state management
│   ├── styles/             # Global styles and Tailwind config
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Pages and Features

### Authentication
- **Login** (`/login`) - User authentication with demo credentials
- **Register** (`/register`) - User registration with role selection

### Main Application
- **Dashboard** (`/`) - Overview with stats, recent orders, low stock alerts
- **Items** (`/items`) - Full CRUD operations for inventory items
- **Orders** (`/orders`) - Order management with status updates
- **Stock History** (`/stock-history`) - Audit trail of stock movements (Admin only)
- **Reports** (`/reports`) - Analytics and insights (Admin only)

### Role-Based Access
- **Staff**: Dashboard, Items (read-only), Orders
- **Admin**: All features including stock history, reports, and full CRUD operations

## Components

### Layout Components
- `Sidebar` - Navigation with role-based menu items
- `Header` - Top navigation with user menu and notifications
- `Layout` - Main layout wrapper with authentication checks

### UI Components
- `Button` - Customizable button with variants and loading states
- `Input` - Form input with validation and error display
- `Loading` - Loading spinner with customizable sizes
- `Notification` - Toast notification system

## State Management

### Auth Store (Zustand)
- User authentication state
- JWT token management
- Role-based access control

### UI Store (Zustand)
- Sidebar state
- Loading states
- Notification system

## API Integration

### Custom Hooks
- `useItems` - Item CRUD operations
- `useOrders` - Order management
- `useReports` - Analytics and reporting
- Authentication hooks with automatic token refresh

### Features
- Automatic token refresh
- Request/response interceptors
- Error handling with user feedback
- Optimistic updates with React Query

## Styling

### Tailwind CSS Classes
- Responsive design utilities
- Custom component classes
- Dark/light theme support
- Animation utilities

### Custom Components
- Consistent design system
- Reusable UI patterns
- Accessible components

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Docker Support

The frontend includes Docker support for containerized deployment:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Follow the established code structure
2. Use TypeScript for type safety
3. Follow the component patterns
4. Test all user flows
5. Ensure responsive design

## License

This project is part of the StoreTrack inventory management system.