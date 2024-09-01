# Shopping App Backend API

This is the backend for a shopping app, built with Node.js, Express, PostgreSQL, and Prisma. JWT is used for user authentication.

## Features
- User authentication (login, signup)
- Product management (add, delete, get all, get one)
- Order management
- Admin controls

## Tech Stack
- **Node.js**: Server runtime
- **Express**: Web framework
- **PostgreSQL**: Database
- **Prisma**: ORM
- **JWT**: Authentication

## Routes

### Public Routes
- `POST /auth/signup`: User signup
- `POST /auth/login`: User login
- `GET /products/getall`: Get all products
- `GET /products/oneproduct/:id`: Get one product by ID

### Signed-in User Routes
- `POST /orders/add`: Add an order
- `GET /orders/userorders`: Get user-specific orders

### Admin Routes
- `POST /products/addproduct`: Add a product
- `DELETE /products/deleteproduct/:id`: Delete a product by ID
- `GET /orders/allorders`: Get all orders
- `GET /users/allusers`: Get all users
- `DELETE /users/deleteuser/:id`: Delete a user by ID
- `POST /adminauth/signup`: Admin signup
- `POST /adminauth/login`: Admin login

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/iGauravSingh/demoshop-backend.git

2. Install dependencies:
    ```bash
    npm install

3. Run the app:
    ```bash
    npm start

