<?php
require 'cors.php';
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->email) && isset($data->password)) {
    $username = trim($data->username);
    $email = trim($data->email);
    $password = password_hash($data->password, PASSWORD_BCRYPT); // Secure hashing

    try {
        $pdo->beginTransaction();

        // 1. Insert into users table
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $password]);
        $userId = $pdo->lastInsertId();

        // 2. Initialize empty profile (1:1 relationship)
        $stmtProfile = $pdo->prepare("INSERT INTO profiles (user_id) VALUES (?)");
        $stmtProfile->execute([$userId]);

        $pdo->commit();
        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}
?>
