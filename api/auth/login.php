
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
    
    if (!empty($data->email) && !empty($data->password)) {
        // Sanitize input
        $email = htmlspecialchars(strip_tags($data->email));
        $password = $data->password;
        
        // Create the query
        $query = "SELECT id, name, email, hashed_password FROM travelers WHERE email = ?";
        
        // Get database connection
        $conn = getConnection();
        
        // Prepare the statement
        $stmt = $conn->prepare($query);
        
        // Execute the statement
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verify the password
            if (password_verify($password, $row['hashed_password'])) {
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "user" => [
                        "id" => $row['id'],
                        "name" => $row['name'],
                        "email" => $row['email']
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
