
<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once '../config/database.php';

// Check if it's a GET request with userId
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId'];
    
    // Get database connection
    $conn = getConnection();
    
    try {
        // Query to get all plans for this user
        $query = "SELECT p.id, p.country, p.city, p.image_url, p.group_type, 
                  p.start_date, p.end_date, p.nb_people, p.cost
                  FROM plans p 
                  WHERE p.traveler_id = ? 
                  ORDER BY p.start_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute([$userId]);
        
        if ($stmt->rowCount() > 0) {
            $reservations = [];
            
            while ($plan = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Get days for this plan
                $daysQuery = "SELECT d.id, d.day_number, d.accommodation, d.image_url,
                             d.accommodation_cost, d.transportation, d.transport_cost
                             FROM days d
                             WHERE d.plan_id = ?
                             ORDER BY d.day_number";
                
                $daysStmt = $conn->prepare($daysQuery);
                $daysStmt->execute([$plan['id']]);
                
                $itinerary = [];
                
                while ($day = $daysStmt->fetch(PDO::FETCH_ASSOC)) {
                    // Get activities for this day
                    $activitiesQuery = "SELECT activity_name, description, cost
                                      FROM activities
                                      WHERE day_id = ?";
                    
                    $activitiesStmt = $conn->prepare($activitiesQuery);
                    $activitiesStmt->execute([$day['id']]);
                    
                    $dayActivities = [];
                    while ($activity = $activitiesStmt->fetch(PDO::FETCH_ASSOC)) {
                        $dayActivities[] = $activity['activity_name'];
                    }
                    
                    $itinerary[] = $dayActivities;
                }
                
                // Calculate duration
                $start = new DateTime($plan['start_date']);
                $end = new DateTime($plan['end_date']);
                $duration = $end->diff($start)->days + 1;
                
                $destination = [
                    "id" => $plan['id'],
                    "name" => $plan['city'] ? $plan['city'] : $plan['country'],
                    "location" => $plan['country'],
                    "description" => "Your trip to " . ($plan['city'] ? $plan['city'] . ", " . $plan['country'] : $plan['country']),
                    "image" => $plan['image_url'] ? $plan['image_url'] : "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=600&q=80",
                    "price" => (float)$plan['cost'],
                    "duration" => $duration
                ];
                
                $reservations[] = [
                    "id" => $plan['id'],
                    "destination" => $destination,
                    "date" => $plan['start_date'],
                    "people" => (int)$plan['nb_people'],
                    "totalPrice" => (float)$plan['cost'],
                    "status" => "confirmed",
                    "bookingReference" => "TP" . str_pad($plan['id'], 6, "0", STR_PAD_LEFT),
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
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Error fetching reservations: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request or missing userId"]);
}
?>
