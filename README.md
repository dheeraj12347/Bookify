# Service Booking Platform

A beginner-friendly full-stack service booking website with customer OTP signup, vendor booking management, JWT authentication, React frontend, Express backend, and MySQL database.

## Tech Stack

- Frontend: React.js with Vite, Tailwind CSS, React Router DOM, Axios, React Toastify
- Backend: Node.js, Express.js
- Database: MySQL
- Auth: JWT, bcrypt
- OTP: Email OTP using Nodemailer

## Project Structure

```txt
service-booking-platform/
  backend/
    config/
    controllers/
    middleware/
    routes/
    sql/
    utils/
  frontend/
    src/
      api/
      components/
      context/
      pages/
```

## MySQL Database Setup

1. Create a MySQL database.
2. Open `backend/sql/schema.sql`.
3. Run the SQL file in MySQL Workbench, phpMyAdmin, or the MySQL CLI.

Example:

```bash
mysql -u root -p < backend/sql/schema.sql
```

The SQL file creates:

- `customers`
- `vendors`
- `services`
- `bookings`
- `otp_verification`

It also inserts sample services.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your local MySQL and email settings.

### Backend Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=service_booking_db
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Service Booking <your_email@gmail.com>
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@bookify.com
ADMIN_PASSWORD=admin123
```

For Gmail, use an App Password instead of your normal Gmail password.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Main Features

Customer:

- Signup with email OTP
- Login and logout
- Browse and search services
- Book services
- View booking history
- Track booking status

Vendor:

- Signup and login
- View service requests matching their category
- Accept bookings
- Reject bookings
- Mark accepted bookings as completed

Admin:

- Simple dashboard for total counts and recent bookings
- Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from backend `.env`

## API Overview

Auth:

- `POST /api/auth/customer/signup`
- `POST /api/auth/customer/verify-otp`
- `POST /api/auth/customer/login`
- `POST /api/auth/vendor/signup`
- `POST /api/auth/vendor/login`
- `POST /api/auth/admin/login`

Services:

- `GET /api/services`

Bookings:

- `POST /api/bookings`
- `GET /api/bookings/customer`
- `GET /api/bookings/vendor`
- `PATCH /api/bookings/:id/accept`
- `PATCH /api/bookings/:id/reject`
- `PATCH /api/bookings/:id/complete`

Profiles:

- `GET /api/profile`
- `PUT /api/profile/customer`
- `PUT /api/profile/vendor`

Admin:

- `GET /api/admin/stats`

## Free Deployment Options

Frontend:

- Vercel
- Netlify

Backend:

- Render
- Railway

Database:

- Railway MySQL
- PlanetScale

## Deploy Frontend

1. Push project to GitHub.
2. Import `frontend` folder into Vercel or Netlify.
3. Set build command:

```bash
npm run build
```

4. Set publish directory:

```txt
dist
```

5. Add environment variable:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Deploy Backend

1. Push project to GitHub.
2. Create a Render or Railway service using the `backend` folder.
3. Set start command:

```bash
npm start
```

4. Add all backend environment variables.
5. Set `FRONTEND_URL` to your deployed frontend URL.

## Notes

- This project intentionally avoids complex tools like Redux, Docker, microservices, Socket.IO, and TypeScript.
- The OTP implementation is simple and assignment-friendly.
- For production, use strong secrets, HTTPS, proper email limits, and a managed database.
