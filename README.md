# Shopping Website (Realtime Pizza)

A full-stack food ordering web app built with **Node.js, Express, MongoDB and EJS**. Customers can browse the menu, add items to a cart, place orders and track order status in real time. Admins can view incoming orders live and update their status.

## Features

- Browse menu items fetched from MongoDB
- Add to cart (session-based, stored in MongoDB via `connect-mongo`)
- User registration and login (Passport.js local strategy, bcrypt password hashing)
- Place orders and view order history
- **Real-time order tracking** with Socket.IO
- **Admin panel** — receive new orders live and change order status
- Flash messages and toast notifications (Noty)

## Tech Stack

| Layer      | Tools |
|------------|-------|
| Backend    | Node.js, Express |
| Database   | MongoDB, Mongoose |
| Auth       | Passport.js, bcrypt, express-session |
| Realtime   | Socket.IO |
| Frontend   | EJS, express-ejs-layouts, SCSS, Tailwind CSS, Axios |
| Build      | Laravel Mix (webpack) |

## Project Structure

```
app/
  config/        # Passport configuration
  http/
    controllers/ # Home, auth, customer & admin controllers
    middlewares/ # auth, guest, admin route guards
  models/        # Menu, Order, User schemas
resources/
  js/            # Frontend JS (cart, admin, socket client)
  scss/          # Styles
  views/         # EJS templates
  menus.json     # Sample menu data
routes/          # Route definitions
public/          # Compiled assets and images
server.js        # App entry point
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally on `mongodb://localhost/pizza`

### Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# then set COOKIE_SECRET in .env
```

Import the sample menu data (optional):

```bash
mongoimport --db pizza --collection menus --file resources/menus.json --jsonArray
```

### Run

```bash
# Compile frontend assets (watch mode)
npm run watch

# Start the server with auto-reload
npm run dev
```

Open http://localhost:3000

To make a user an admin, set their `role` field to `admin` in the `users` collection.

## Scripts

| Command              | Description |
|----------------------|-------------|
| `npm run dev`        | Start server with nodemon |
| `npm run serve`      | Start server with node |
| `npm run watch`      | Build assets and watch for changes |
| `npm run production` | Build minified assets for production |

## Author

Vikram
