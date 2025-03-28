
# Travel Planner Application

A full-stack travel planning application with booking system.

## Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Backend Setup

1. Install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL from the XAMPP Control Panel
3. Import the database schema:
   - Open http://localhost/phpmyadmin in your browser
   - Create a new database called `travel_planner`
   - Click on the "Import" tab
   - Select the file `db/travel_planner.sql` from the project directory
   - Click "Go" to import the schema

4. Configure the PHP backend:
   - Copy the `api` folder to your XAMPP htdocs directory (usually located at `C:\xampp\htdocs\` on Windows or `/Applications/XAMPP/htdocs/` on Mac)
   - The API will be accessible at http://localhost/travel_planner/api/

## Features

- User authentication (login/signup)
- Browse travel destinations
- View detailed trip information
- Plan custom itineraries
- Book trips with payment processing
- View your booked trips in dashboard

## Credit Card Testing

For testing the booking system, use any 16-digit card number, any future expiry date in MM/YY format, and any 3-digit CVV. All payments will be accepted in this demo version.

## API Endpoints

- Authentication: `/api/auth/`
- Destinations: `/api/trips/`
- Reservations: `/api/trips/book.php`
- User profile: `/api/user/`
