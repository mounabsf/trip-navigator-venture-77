
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
    
    if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
        // Sanitize input
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $password = $data->password;
        
        // Check if email already exists
        $conn = getConnection();
        $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->execute([$email]);
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            exit();
        }
        
        // Hash the password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Create the query
        $query = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";
        
        // Prepare the statement
        $stmt = $conn->prepare($query);
        
        // Execute the statement
        if ($stmt->execute([$name, $email, $password_hash])) {
            echo json_encode([
                "success" => true,
                "message" => "User registered successfully",
                "user" => [
                    "id" => $conn->lastInsertId(),
                    "name" => $name,
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Unable to register user"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
