
# Travelers Planner

A travel planning application that lets users browse destinations, plan trips, and manage reservations.

## Setup Instructions

### Database Setup
1. Start your EasyPHP installation
2. Open phpMyAdmin (MySQL Administration)
3. Create a new database called `travelers_planner`
4. Import the SQL file from `db/travelers_planner.sql`

### Backend Setup
1. Locate your EasyPHP localweb directory (typically `C:\Program Files (x86)\EasyPHP-Devserver\data\localweb\`)
2. Create a folder named `travelers_planner`
3. Copy the `api` folder from this project into the `travelers_planner` folder
4. Your structure should look like:
   ```
   [EasyPHP path]/data/localweb/travelers_planner/api/...
   ```
5. Make sure both HTTP and MySQL servers are running in EasyPHP

### Frontend Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173/)

### Testing the Connection
1. Navigate to the test page at `/test-connection`
2. Click "Test Connection" to verify database connectivity
3. Click "Test Registration" to test user creation

## Default Credentials
- Email: test123@example.com
- Password: password123

