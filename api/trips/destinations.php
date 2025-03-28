
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Create the query
    $query = "SELECT * FROM travel_plans";
    
    // Get database connection
    $conn = getConnection();
    
    // Prepare and execute the statement
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $destinations = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $destinations[] = [
                "id" => $row['id'],
                "name" => $row['title'],
                "location" => $row['location'],
                "description" => $row['description'],
                "image" => $row['image_url'],
                "price" => (float)$row['price'],
                "duration" => (int)$row['duration']
            ];
        }
        
        echo json_encode([
            "success" => true,
            "data" => $destinations
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "data" => []
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
