# KGL Groceries API

A comprehensive Express.js API for managing grocery procurement, sales, and user operations with MongoDB database integration.

## Features

- **Three-Router Architecture**
  - `procurementRoutes`: Record and manage produce purchases from dealers/farms
  - `salesRoutes`: Handle cash and credit/deferred sales transactions
  - `userRoutes`: User management and authentication with role-based access control

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Manager, Sales Agent)
  - Secure password hashing with bcryptjs

- **API Documentation**
  - Swagger UI integrated at `/api-docs`
  - Complete endpoint documentation with request/response examples
  - OpenAPI 3.0 specification

- **Data Validation**
  - Comprehensive input validation using Joi
  - Phone number format validation
  - NIN (National ID) format validation
  - Min/max constraints on all numeric fields

## Project Structure

```
KGL-Groceries-API/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── User.js              # User schema (Manager, Sales Agent)
│   ├── Procurement.js       # Procurement schema
│   └── Sales.js             # Sales schema (Cash & Credit)
├── controllers/
│   ├── userController.js    # User management logic
│   ├── procurementController.js
│   └── salesController.js
├── routes/
│   ├── userRoutes.js        # User/Auth endpoints
│   ├── procurementRoutes.js
│   └── salesRoutes.js
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   └── validation.js        # Input validation middleware
├── server.js                # Main application file
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/KGL-Groceries-API.git
cd KGL-Groceries-API
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# PORT=3000
# NODE_ENV=development
# DATABASE_URI=mongodb://localhost:27017/karibu_groceries_db
# JWT_SECRET=your_jwt_secret_here
```

4. **Start MongoDB**
Ensure MongoDB is running on your machine or remote server.

5. **Run the server**
```bash
# Development with nodemon
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /users/login` - Login with username/email and password
  - Status 200: User exists and credentials valid
  - Status 401: Invalid credentials

### Users Management
- `POST /users` - Create new user (Manager or Sales Agent)
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Procurement (Manager only)
- `POST /procurement` - Record new procurement
  - Fields: produceName, produceType, date, time, tonnage (min 100kg), cost (min 10000), dealerName, branch (Maganjo/Matugga), contact, sellingPrice
- `GET /procurement` - Get all procurements
- `GET /procurement/{id}` - Get procurement by ID
- `PUT /procurement/{id}` - Update procurement
- `DELETE /procurement/{id}` - Delete procurement

### Sales (Sales Agent only)
- `POST /sales/cash` - Record cash sale
  - Fields: produceName, tonnage, amountPaid (min 5 digits), buyerName, salesAgentName, date, time
- `POST /sales/credit` - Record credit/deferred sale
  - Fields: buyerName, nin (14 digits), location, contact, amountDue, salesAgentName, dueDate, produceName, produceType, tonnage, dispatchDate
- `GET /sales` - Get all sales
- `GET /sales/type/{type}` - Get sales by type (Cash/Credit)
- `GET /sales/{id}` - Get sale by ID
- `PUT /sales/{id}` - Update sale
- `DELETE /sales/{id}` - Delete sale

## API Documentation

Full API documentation is available at:
```
http://localhost:3000/api-docs
```

## Validation Rules

### Procurement Fields
- **produceName**: Alphanumeric
- **produceType**: Alphabetic only, min 2 characters
- **tonnage**: Numeric, minimum 100kg
- **cost**: Numeric, minimum 10000 UgX
- **dealerName**: Alphanumeric, min 2 characters
- **branch**: Maganjo or Matugga
- **contact**: Valid Ugandan phone number (+256XXXXXXXXX or 0XXXXXXXXX)
- **sellingPrice**: Numeric, minimum 10000 UgX

### Sales Fields (Cash)
- **produceName**: Alphanumeric
- **amountPaid**: Numeric, minimum 10000 UgX
- **buyerName**: Alphanumeric, min 2 characters
- **salesAgentName**: Alphanumeric, min 2 characters

### Sales Fields (Credit)
- **buyerName**: Alphanumeric, min 2 characters
- **nin**: Valid 14-digit NIN
- **location**: Alphanumeric, min 2 characters
- **contact**: Valid Ugandan phone number
- **amountDue**: Numeric, minimum 10000 UgX
- **produceType**: Alphabetic only

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Obtain a token by logging in:
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "simon",
    "password": "password123"
  }'
```

## Role-Based Access Control

- **Manager**: Can record procurements, view all data
- **Sales Agent**: Can record sales, view all data

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token or invalid credentials)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Example Usage

### 1. Create a Manager User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <manager_token>" \
  -d '{
    "username": "manager1",
    "email": "manager@kgl.com",
    "password": "securepass123",
    "role": "Manager",
    "contact": "+256701234567"
  }'
```

### 2. Create a Sales Agent User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <manager_token>" \
  -d '{
    "username": "agent1",
    "email": "agent@kgl.com",
    "password": "securepass123",
    "role": "Sales Agent",
    "contact": "+256702234567"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager1",
    "password": "securepass123"
  }'
```

### 4. Record Procurement (Manager)
```bash
curl -X POST http://localhost:3000/procurement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <manager_token>" \
  -d '{
    "produceName": "Bananas",
    "produceType": "Fruits",
    "date": "2026-02-15",
    "time": "14:30",
    "tonnage": 150,
    "cost": 500000,
    "dealerName": "simon Dealer",
    "branch": "Maganjo",
    "contact": "+256789121378",
    "sellingPrice": 600000
  }'
```

### 5. Record Cash Sale (Sales Agent)
```bash
curl -X POST http://localhost:3000/sales/cash \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <agent_token>" \
  -d '{
    "produceName": "Bananas",
    "tonnage": 50,
    "amountPaid": 250000,
    "buyerName": "Jane Buyer",
    "salesAgentName": "simon Agent",
    "date": "2026-02-15",
    "time": "10:30"
  }'
```

### 6. Record Credit Sale (Sales Agent)
```bash
curl -X POST http://localhost:3000/sales/credit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <agent_token>" \
  -d '{
    "buyerName": "Jane Trader",
    "nin": "12345678901234",
    "location": "Kampala",
    "contact": "+256789121378",
    "amountDue": 500000,
    "salesAgentName": "simon Agent",
    "dueDate": "2026-03-15",
    "produceName": "Tomatoes",
    "produceType": "Vegetables",
    "tonnage": 100,
    "dispatchDate": "2026-02-15"
  }'
```

## Environment Variable Template (.env.example)

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection
DATABASE_URI=mongodb://localhost:27017/karibu_groceries_db

# Authentication Secrets
JWT_SECRET=your_jwt_secret_here
```

## Git Best Practices

The following files are ignored from version control:
- `.env` (actual secrets, DO NOT commit)
- `node_modules/`
- Log files
- OS-specific files

Always use `.env.example` as template for configuration.

## Technologies Used

- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **JWT**: Token-based authentication
- **Swagger**: API documentation
- **Joi**: Schema validation
- **CORS**: Cross-Origin Resource Sharing
- **Nodemon**: Development tool

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
