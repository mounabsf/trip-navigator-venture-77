
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"));
    
    if (
        !empty($data->userId) && 
        !empty($data->destinationId) && 
        !empty($data->travelDate) && 
        !empty($data->travelers) && 
        !empty($data->totalPrice)
    ) {
        // Get database connection
        $conn = getConnection();
        
        try {
            // Begin transaction
            $conn->beginTransaction();
            
            // Create reservation
            $reservationQuery = "INSERT INTO reservations (user_id, travel_plan_id, travel_date, num_people, total_price) 
                               VALUES (?, ?, ?, ?, ?)";
            
            $reservationStmt = $conn->prepare($reservationQuery);
            $reservationStmt->execute([
                $data->userId,
                $data->destinationId,
                $data->travelDate,
                $data->travelers,
                $data->totalPrice
            ]);
            
            $reservationId = $conn->lastInsertId();
            
            // Store itinerary if provided
            if (!empty($data->itinerary) && is_array($data->itinerary)) {
                $itineraryQuery = "INSERT INTO itineraries (reservation_id, day_number, morning_activity, afternoon_activity, evening_activity) 
                                 VALUES (?, ?, ?, ?, ?)";
                
                $itineraryStmt = $conn->prepare($itineraryQuery);
                
                foreach ($data->itinerary as $dayIndex => $dayActivities) {
                    $itineraryStmt->execute([
                        $reservationId,
                        $dayIndex + 1,
                        $dayActivities[0] ?? '',
                        $dayActivities[1] ?? '',
                        $dayActivities[2] ?? ''
                    ]);
                }
            }
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Reservation successful",
                "data" => [
                    "reservationId" => $reservationId,
                    "bookingReference" => "TP-" . rand(100000, 999999)
                ]
            ]);
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollBack();
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
