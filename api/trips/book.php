
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Function to generate a booking reference
function generateBookingReference($length = 8) {
    $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $reference = '';
    $max = strlen($characters) - 1;
    
    for ($i = 0; $i < $length; $i++) {
        $reference .= $characters[mt_rand(0, $max)];
    }
    
    return $reference;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->userId) && !empty($data->destinationId) && 
        !empty($data->travelDate) && !empty($data->travelers) && 
        !empty($data->totalPrice) && !empty($data->itinerary)) {
        
        // Generate booking reference
        $bookingReference = generateBookingReference();
        
        try {
            // Get database connection
            $conn = getConnection();
            $conn->beginTransaction();
            
            // Insert into reservations table
            $reservationQuery = "INSERT INTO reservations (user_id, travel_plan_id, travel_date, num_people, total_price, status, booking_reference) 
                               VALUES (?, ?, ?, ?, ?, 'confirmed', ?)";
            
            $reservationStmt = $conn->prepare($reservationQuery);
            $reservationStmt->execute([
                $data->userId,
                $data->destinationId,
                $data->travelDate,
                $data->travelers,
                $data->totalPrice,
                $bookingReference
            ]);
            
            $reservationId = $conn->lastInsertId();
            
            // Insert itinerary items
            foreach ($data->itinerary as $dayIndex => $activities) {
                $dayNumber = $dayIndex + 1;
                $morningActivity = $activities[0] ?? '';
                $afternoonActivity = $activities[1] ?? '';
                $eveningActivity = $activities[2] ?? '';
                
                $itineraryQuery = "INSERT INTO itineraries (reservation_id, day_number, morning_activity, afternoon_activity, evening_activity) 
                                 VALUES (?, ?, ?, ?, ?)";
                
                $itineraryStmt = $conn->prepare($itineraryQuery);
                $itineraryStmt->execute([
                    $reservationId,
                    $dayNumber,
                    $morningActivity,
                    $afternoonActivity,
                    $eveningActivity
                ]);
            }
            
            $conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Reservation created successfully",
                "data" => [
                    "reservationId" => $reservationId,
                    "bookingReference" => $bookingReference
                ]
            ]);
            
        } catch (PDOException $e) {
            if ($conn) {
                $conn->rollBack();
            }
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
