
<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'travel_planner');
define('DB_USER', 'root');
define('DB_PASS', '');

// Create a PDO connection
function getConnection() {
    try {
        $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        echo json_encode(['error' => "Connection failed: " . $e->getMessage()]);
        exit();
    }
}
?>
