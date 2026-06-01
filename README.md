# Inventory & Order Management System

A simplified full-stack inventory and order management application for managing products, customers, orders, and stock tracking.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy
- Database: PostgreSQL
- Frontend: React, Vite, Tailwind CSS, Axios
- Containers: Docker, Docker Compose
- Web server: Nginx for frontend production build

## Features

- Product CRUD with unique SKU validation
- Customer CRUD with unique email validation
- Order creation with multiple line items
- Inventory validation before order creation
- Automatic stock reduction after successful order placement
- Order total auto-calculation
- Order status updates: pending, confirmed, shipped, delivered, cancelled
- Dashboard with totals, revenue, low stock alerts, and recent orders
- Environment-variable based configuration
- Dockerized backend, frontend, and PostgreSQL database

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` before running locally.

| Variable | Description | Example |
| --- | --- | --- |
| `POSTGRES_USER` | PostgreSQL username | `inventory_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `inventory_password` |
| `POSTGRES_DB` | PostgreSQL database name | `inventory_db` |
| `POSTGRES_PORT` | Local PostgreSQL port | `5432` |
| `BACKEND_PORT` | Local backend port | `8000` |
| `FRONTEND_PORT` | Local frontend port | `3000` |
| `CORS_ORIGINS` | Comma-separated frontend URLs allowed by backend | `http://localhost:3000` |
| `VITE_API_URL` | Backend API URL used by React | `http://localhost:8000` |
| `DATABASE_URL` | Full PostgreSQL URL for backend deployments | `postgresql://user:pass@host:5432/db` |

## Run Locally With Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger API Docs: `http://localhost:8000/docs`

## Backend API Endpoints

### Products

- `GET /products` - List products
- `POST /products` - Create product
- `GET /products/{id}` - Get product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Customers

- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /customers/{id}` - Get customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

### Orders

- `GET /orders` - List orders with order items
- `POST /orders` - Create order and reduce stock
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status
- `DELETE /orders/{id}` - Delete order

### Dashboard

- `GET /dashboard` - Summary metrics, low stock items, and recent orders

## Deployment Guide

### Backend on Render

1. Push this repository to GitHub.
2. Create a PostgreSQL database on Render, Railway, Supabase, or Neon.
3. Create a Render Web Service from the `backend` folder.
4. Use this start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. Add environment variables:
   - `DATABASE_URL`
   - `CORS_ORIGINS`

### Frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add environment variable:
   - `VITE_API_URL=https://your-render-backend-url.onrender.com`
4. Deploy.

### Docker Hub Images

```bash
docker build -t yourdockerhubusername/inventory-backend:latest ./backend
docker build -t yourdockerhubusername/inventory-frontend:latest ./frontend
docker push yourdockerhubusername/inventory-backend:latest
docker push yourdockerhubusername/inventory-frontend:latest
```

This repository also includes a GitHub Actions workflow at `.github/workflows/docker-backend.yml`.
Add these GitHub repository secrets to automatically publish the backend image:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Submission Links

- GitHub Repository: `https://github.com/08niteshh/inventory-order-management-system`
- Backend Docker Image: `https://hub.docker.com/r/8nitesh/inventory-backend`
- Frontend Docker Image: `PASTE_YOUR_FRONTEND_DOCKER_HUB_LINK_HERE`
- Live Backend URL: `PASTE_YOUR_RENDER_BACKEND_URL_HERE`
- Live Frontend URL: `PASTE_YOUR_VERCEL_FRONTEND_URL_HERE`
