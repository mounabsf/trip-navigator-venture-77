
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Generate a random booking reference
function generateBookingReference($length = 8) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $reference = '';
    for ($i = 0; $i < $length; $i++) {
        $reference .= $characters[rand(0, strlen($characters) - 1)];
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
        
        // Get database connection
        $conn = getConnection();
        $conn->beginTransaction();
        
        try {
            // First get the destination details to copy for the new plan
            $destQuery = "SELECT country, city, image_url FROM plans WHERE id = ?";
            $destStmt = $conn->prepare($destQuery);
            $destStmt->execute([$data->destinationId]);
            $destination = $destStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$destination) {
                throw new Exception("Destination not found");
            }
            
            // Calculate end date based on number of days in itinerary
            $start_date = new DateTime($data->travelDate);
            $days = count($data->itinerary);
            $end_date = clone $start_date;
            $end_date->modify('+' . ($days - 1) . ' days');
            
            // Create new plan
            $planQuery = "INSERT INTO plans (traveler_id, country, city, image_url, group_type, 
                           start_date, end_date, nb_people, cost) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $planStmt = $conn->prepare($planQuery);
            $planStmt->execute([
                $data->userId,
                $destination['country'],
                $destination['city'],
                $destination['image_url'],
                'friends', // Default group type
                $start_date->format('Y-m-d'),
                $end_date->format('Y-m-d'),
                $data->travelers,
                $data->totalPrice
            ]);
            
            $planId = $conn->lastInsertId();
            $bookingRef = generateBookingReference();
            
            // Add days and activities from itinerary
            foreach ($data->itinerary as $index => $dayActivities) {
                $dayNumber = $index + 1;
                $dayQuery = "INSERT INTO days (plan_id, day_number, accommodation, accommodation_cost) 
                            VALUES (?, ?, ?, ?)";
                $dayStmt = $conn->prepare($dayQuery);
                $dayStmt->execute([
                    $planId,
                    $dayNumber,
                    'Hotel accommodation',
                    100.00 // Default accommodation cost
                ]);
                
                $dayId = $conn->lastInsertId();
                
                // Add activities for this day
                foreach ($dayActivities as $activityIndex => $activity) {
                    $activityQuery = "INSERT INTO activities (day_id, activity_name, cost) 
                                     VALUES (?, ?, ?)";
                    $activityStmt = $conn->prepare($activityQuery);
                    $activityStmt->execute([
                        $dayId,
                        $activity,
                        0.00 // Default cost
                    ]);
                }
                
                // Add default meals
                $mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
                foreach ($mealTypes as $type) {
                    $mealQuery = "INSERT INTO meals (day_id, meal_type, description, cost) 
                                 VALUES (?, ?, ?, ?)";
                    $mealStmt = $conn->prepare($mealQuery);
                    $mealStmt->execute([
                        $dayId,
                        $type,
                        $type . ' at local restaurant',
                        20.00 // Default cost
                    ]);
                }
            }
            
            $conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Trip booked successfully",
                "data" => [
                    "planId" => $planId,
                    "bookingReference" => $bookingRef
                ]
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode([
                "success" => false,
                "message" => "Booking failed: " . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
