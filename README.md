
# Travel Planner Application

A full-stack travel planning application built with React, TypeScript, and PHP.

## Running the Application

### Prerequisites

- Node.js (v14 or newer)
- PHP (v7.4 or newer)
- MySQL or MariaDB
- A web server like Apache or Nginx

### Frontend Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. The frontend will be available at `http://localhost:5173` (or the port shown in your terminal)

### Backend Setup

1. Make sure your web server (Apache/Nginx) is running
2. Import the database schema:
```bash
mysql -u your_username -p your_database_name < db/travel_planner.sql
```
3. Configure your database connection in `api/config/database.php`
4. Place the `api` folder in your web server's document root (or create a virtual host pointing to it)
5. The API endpoints will be available at `http://localhost/travel_planner/api/` (adjust based on your server configuration)

### Connecting Frontend to Backend

The frontend is configured to connect to the backend at `http://localhost/travel_planner/api`. If your backend is at a different location, update the `API_URL` constant in `src/services/api.ts`.

## Features

- Browse popular travel destinations
- View detailed information about destinations
- Plan customized trips with generated itineraries
- Book trips with a simple reservation system
- User authentication and profile management
- View and manage trip reservations

## Project Structure

- `/src`: Frontend React application
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
  - `/services`: API communication
  - `/context`: Application state management
- `/api`: Backend PHP application
  - `/auth`: Authentication endpoints
  - `/trips`: Trip and destination endpoints
  - `/user`: User profile and reservation endpoints
  - `/config`: Server configuration
- `/db`: Database schema and setup scripts

## Development

To work on both frontend and backend simultaneously:

1. Run the frontend development server with `npm run dev`
2. Configure your local web server to serve the PHP backend
3. Make API calls from the frontend to your local backend server
