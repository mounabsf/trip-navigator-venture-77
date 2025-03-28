
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
    
    if (!empty($data->reservationId) && !empty($data->userId)) {
        // Get database connection
        $conn = getConnection();
        
        // First check if the reservation belongs to the user
        $checkQuery = "SELECT id FROM reservations WHERE id = ? AND user_id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->execute([$data->reservationId, $data->userId]);
        
        if ($checkStmt->rowCount() > 0) {
            // Update the reservation status to cancelled
            $updateQuery = "UPDATE reservations SET status = 'cancelled' WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            
            if ($updateStmt->execute([$data->reservationId])) {
                echo json_encode([
                    "success" => true,
                    "message" => "Reservation cancelled successfully"
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Unable to cancel reservation"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Reservation not found or doesn't belong to user"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
