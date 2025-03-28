
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['userId']) && !empty($_GET['userId'])) {
        $userId = htmlspecialchars(strip_tags($_GET['userId']));
        
        // Get database connection
        $conn = getConnection();
        
        // Create query to get reservations with destination details
        $query = "SELECT r.id, r.travel_date, r.num_people, r.total_price, r.status,
                        tp.id as destination_id, tp.title as destination_name, tp.location, tp.image_url, tp.duration
                 FROM reservations r
                 JOIN travel_plans tp ON r.travel_plan_id = tp.id
                 WHERE r.user_id = ?
                 ORDER BY r.travel_date DESC";
        
        // Prepare and execute the statement
        $stmt = $conn->prepare($query);
        $stmt->execute([$userId]);
        
        if ($stmt->rowCount() > 0) {
            $reservations = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Get itinerary for this reservation
                $itineraryQuery = "SELECT day_number, morning_activity, afternoon_activity, evening_activity 
                                  FROM itineraries 
                                  WHERE reservation_id = ? 
                                  ORDER BY day_number";
                
                $itineraryStmt = $conn->prepare($itineraryQuery);
                $itineraryStmt->execute([$row['id']]);
                
                $itinerary = [];
                while ($itineraryRow = $itineraryStmt->fetch(PDO::FETCH_ASSOC)) {
                    $itinerary[] = [
                        $itineraryRow['morning_activity'],
                        $itineraryRow['afternoon_activity'],
                        $itineraryRow['evening_activity']
                    ];
                }
                
                $reservations[] = [
                    "id" => $row['id'],
                    "destination" => [
                        "id" => $row['destination_id'],
                        "name" => $row['destination_name'],
                        "location" => $row['location'],
                        "image" => $row['image_url'],
                        "duration" => (int)$row['duration']
                    ],
                    "date" => $row['travel_date'],
                    "people" => (int)$row['num_people'],
                    "totalPrice" => (float)$row['total_price'],
                    "status" => $row['status'],
                    "bookingReference" => "TP-" . (100000 + $row['id']),
                    "itinerary" => $itinerary
                ];
            }
            
            echo json_encode([
                "success" => true,
                "data" => $reservations
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "data" => []
            ]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
