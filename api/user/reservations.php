
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['userId']) && is_numeric($_GET['userId'])) {
        $userId = (int)$_GET['userId'];
        
        try {
            // Get database connection
            $conn = getConnection();
            
            // Get reservations with destination info
            $query = "SELECT r.id, r.travel_date, r.num_people, r.total_price, r.status, r.booking_reference,
                            t.id as destination_id, t.title as destination_name, t.location, t.image_url, t.duration
                     FROM reservations r
                     INNER JOIN travel_plans t ON r.travel_plan_id = t.id
                     WHERE r.user_id = ?
                     ORDER BY r.created_at DESC";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([$userId]);
            
            if ($stmt->rowCount() > 0) {
                $reservations = [];
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $reservationId = $row['id'];
                    
                    // Get itinerary for this reservation
                    $itineraryQuery = "SELECT day_number, morning_activity, afternoon_activity, evening_activity
                                     FROM itineraries
                                     WHERE reservation_id = ?
                                     ORDER BY day_number";
                    
                    $itineraryStmt = $conn->prepare($itineraryQuery);
                    $itineraryStmt->execute([$reservationId]);
                    
                    $itinerary = [];
                    while ($itineraryRow = $itineraryStmt->fetch(PDO::FETCH_ASSOC)) {
                        $itinerary[] = [
                            $itineraryRow['morning_activity'],
                            $itineraryRow['afternoon_activity'],
                            $itineraryRow['evening_activity']
                        ];
                    }
                    
                    $reservations[] = [
                        "id" => $reservationId,
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
                        "bookingReference" => $row['booking_reference'],
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
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid or missing user ID"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
