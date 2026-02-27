<?php
require 'cors.php';
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = trim($data->email);
    $password = $data->password;

    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if($user && password_verify($password, $user['password'])) {
        // In a production app, use JWT tokens here. 
        // For this project, we return the user info to store in React state.
        unset($user['password']); // Don't send password back
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}
?>
