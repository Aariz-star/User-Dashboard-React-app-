<?php
require 'cors.php';
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// We expect a user_id in the query string (GET) or body (POST)
// Example GET: backend/profile.php?user_id=1

if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if ($user_id) {
        $stmt = $pdo->prepare("SELECT u.username, u.email, p.full_name, p.bio, p.avatar_url FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.id = ?");
        $stmt->execute([$user_id]);
        $profile = $stmt->fetch();
        echo json_encode($profile);
    }
} elseif ($method === 'POST') {
    // Update Profile
    if(isset($data->user_id)) {
        $stmt = $pdo->prepare("UPDATE profiles SET full_name = ?, bio = ?, avatar_url = ? WHERE user_id = ?");
        $stmt->execute([$data->full_name, $data->bio, $data->avatar_url, $data->user_id]);
        echo json_encode(["success" => true, "message" => "Profile updated"]);
    }
}
?>
