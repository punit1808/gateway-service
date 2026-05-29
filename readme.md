# Gateway Service

Node.js-based API Gateway for routing and JWT authentication in a microservices architecture.

## Features

- JWT validation middleware
- Proxy routing using `http-proxy-middleware`
- Public and protected route handling
- Internal header injection
- Spring Boot JWT compatibility
- ES Module support

---

## Tech Stack

- Node.js
- Express
- http-proxy-middleware
- jsonwebtoken
- dotenv
- helmet
- cors
- morgan

---

## Architecture

```text
Frontend
   |
   v
Node Gateway
   |
-------------------------
|                       |
Auth Service      Spring Backend

PORT=8080

JWT_SECRET=YOUR_BASE64_SECRET

AUTH_SERVICE_URL=http://localhost:8081

BACKEND_SERVICE_URL=http://localhost:8082