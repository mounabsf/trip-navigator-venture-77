
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Create the query to select unique countries/cities
    $query = "SELECT DISTINCT id, traveler_id, country, city, image_url, group_type, 
              start_date, end_date, nb_people, cost 
              FROM plans 
              ORDER BY country, city";
    
    // Get database connection
    $conn = getConnection();
    
    // Prepare and execute the statement
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $destinations = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Calculate duration in days from start_date to end_date
            $start = new DateTime($row['start_date']);
            $end = new DateTime($row['end_date']);
            $duration = $end->diff($start)->days + 1; // +1 to include both start and end dates
            
            $destinations[] = [
                "id" => $row['id'],
                "name" => $row['city'] ? $row['city'] : $row['country'], // Use city if available, otherwise country
                "location" => $row['country'],
                "description" => "Explore the beauty of " . ($row['city'] ? $row['city'] . ", " . $row['country'] : $row['country']),
                "image" => $row['image_url'] ? $row['image_url'] : "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=600&q=80",
                "price" => (float)$row['cost'],
                "duration" => $duration,
                "group_type" => $row['group_type'],
                "nb_people" => (int)$row['nb_people']
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
