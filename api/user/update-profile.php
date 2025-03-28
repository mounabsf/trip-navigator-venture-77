
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
    
    if (!empty($data->userId) && !empty($data->name) && !empty($data->email)) {
        // Sanitize input
        $userId = htmlspecialchars(strip_tags($data->userId));
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        
        // Get database connection
        $conn = getConnection();
        
        // Check if email already exists for another user
        $checkQuery = "SELECT id FROM users WHERE email = ? AND id != ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->execute([$email, $userId]);
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Email already in use by another user"]);
            exit();
        }
        
        // Create the query based on whether password is being updated
        if (!empty($data->password)) {
            $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            $query = "UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?";
            $params = [$name, $email, $password_hash, $userId];
        } else {
            $query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            $params = [$name, $email, $userId];
        }
        
        // Prepare and execute the statement
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully",
                "user" => [
                    "id" => $userId,
                    "name" => $name,
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Unable to update profile"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
