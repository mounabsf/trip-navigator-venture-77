
# Travel Planner Application

A full-stack travel planning application built with React, TypeScript, and PHP.

## Running the Application with XAMPP

### Prerequisites

- [XAMPP](https://www.apachefriends.org/download.html) (for PHP, MySQL, and Apache)
- [Node.js](https://nodejs.org/) (v14 or newer)

### Backend Setup (XAMPP)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `travel_planner`
   - Import the database schema from `db/travel_planner.sql`:
     - Click on your `travel_planner` database
     - Go to "Import" tab
     - Choose the file `db/travel_planner.sql`
     - Click "Go" to import

3. **API Setup**
   - Copy the entire `api` folder to your XAMPP htdocs directory:
     - Windows: `C:\xampp\htdocs\travel_planner\api\`
     - Mac: `/Applications/XAMPP/htdocs/travel_planner/api/`
     - Linux: `/opt/lampp/htdocs/travel_planner/api/`
   
   - Make sure the API is accessible at: `http://localhost/travel_planner/api/`

4. **Configure Database Connection**
   - Check `api/config/database.php` and ensure it has the correct MySQL credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'travel_planner');
     define('DB_USER', 'root');  // Default XAMPP MySQL username
     define('DB_PASS', '');      // Default XAMPP MySQL password (usually empty)
     ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - The frontend will be available at: `http://localhost:5173` (or the port shown in your terminal)
   - Make sure `src/services/api.ts` has the correct API URL:
     ```typescript
     const API_URL = 'http://localhost/travel_planner/api';
     ```

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure Apache is running in XAMPP
   - Verify the API URL in `src/services/api.ts`
   - Check CORS headers in PHP files

2. **Database Connection Issues**
   - Verify MySQL is running in XAMPP
   - Check database credentials in `api/config/database.php`
   - Ensure the database `travel_planner` exists

3. **Missing Destinations**
   - Make sure the `travel_plans` table was properly imported
   - Check the PHP error logs in XAMPP

4. **PHP Errors**
   - Check XAMPP error logs at:
     - Windows: `C:\xampp\php\logs\php_error_log`
     - Mac/Linux: `/Applications/XAMPP/logs/php_error_log`

## Features

- Browse popular travel destinations
- View detailed information about destinations
- Plan customized trips with generated itineraries
- Book trips with a simple reservation system
- User authentication and profile management
- View and manage trip reservations
