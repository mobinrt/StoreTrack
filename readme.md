# StoreTrack Backend Side Readme

Backend API for **StoreTrack**, built with **Node.js**, **Express**, and **MongoDB**.

## Features

* Item management (CRUD)
* Order management (create, update, cancel, delete)
* Stock history tracking (GET only)
* Low-stock report endpoint
* Authentication & role-based access (admin, staff)
* JWT-based authentication
* Dockerized for easy development and deployment

---

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Variables](#environment-variables)
4. [Run Project Locally](#run-project-locally)
5. [Run Project with Docker](#run-project-with-docker)
6. [API Endpoints](#api-endpoints)
7. [Postman Testing](#postman-testing)

---

## **Prerequisites**

* Node.js v20+
* npm v9+
* Docker & Docker Compose (if running in containers)
* MongoDB (if running locally)

---

## **Setup**

1. Clone the repo:

```bash
git clone <your-repo-url>
cd storetrack-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (see [Environment Variables](#environment-variables)).

---

## **Environment Variables**

Create `.env` in the project root **and do NOT commit it**:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/storetrack   # use `mongo` for Docker
JWT_SECRET=supersecretjwt
NODE_ENV=development
```

> ⚠️ Make sure `.env` is included in `.gitignore` to protect secrets.

---

## **Run Project Locally (without Docker)**

1. Make sure MongoDB is running locally.
2. Start the backend:

```bash
npm run dev   # uses nodemon for hot reload
```

* API will be available at: `http://localhost:3000`

---

## **Run Project with Docker**

### 1. Build and start containers:

```bash
docker-compose up --build
```

* The **API container** listens on `http://localhost:3000`
* The **MongoDB container** listens on `mongodb://localhost:27017` (inside Docker, API talks to `mongo:27017`)

### 2. Stop containers:

```bash
docker-compose down
```

### 3. Remove containers + volumes (optional):

```bash
docker-compose down -v
```

> The first run may take a few minutes while Docker downloads images and builds the API container.

---

## **API Endpoints**

**Auth**

* `POST /api/auth/login` → Login, returns JWT token
* `POST /api/auth/register` → (optional) create new user

**Items**

* `POST /api/items` → Add new item (admin only)
* `GET /api/items` → List all items
* `GET /api/items/:id` → Get single item
* `PUT /api/items/:id` → Update item (admin only)
* `DELETE /api/items/:id` → Delete item (admin only)

**Orders**

* `POST /api/orders` → Create order (deduct stock automatically)
* `GET /api/orders` → List orders
* `GET /api/orders/:id` → Get single order
* `PUT /api/orders/:id/status` → Update order status

**Stock History**

* `GET /api/stock-history` → Get stock change records
* `GET /api/stock-history:id` → Get stock change record

**Reports**

* `GET /api/reports/low-stock` → Items below threshold
* `GET /api/reports/sales` → Summarize sales by date range

> All protected routes require `Authorization: Bearer <JWT_TOKEN>` header.

---

## **Postman Testing**

1. Import your Postman collection (optional)
2. Set **base URL** to `http://localhost:3000`
3. For protected routes, add header:

```
Authorization: Bearer <your-jwt-token>
```

4. Test endpoints like any standard API.

---

## **Notes**

* Always use `.env` for secrets; do not hardcode JWT or DB URLs.
* In Docker, use **service names** (`mongo`) for internal networking.
* Retry logic is implemented in DB connection to handle container startup timing.

