
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
        $userId = (int)$data->userId;
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        
        // Get database connection
        $conn = getConnection();
        
        // Check if the email is already taken by another user
        $emailCheckQuery = "SELECT id FROM users WHERE email = ? AND id != ?";
        $emailCheckStmt = $conn->prepare($emailCheckQuery);
        $emailCheckStmt->execute([$email, $userId]);
        
        if ($emailCheckStmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Email is already taken by another user"]);
            exit();
        }
        
        // If password is provided, update it too
        if (!empty($data->password)) {
            $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            $updateQuery = "UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateResult = $updateStmt->execute([$name, $email, $password_hash, $userId]);
        } else {
            $updateQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateResult = $updateStmt->execute([$name, $email, $userId]);
        }
        
        if ($updateResult) {
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
