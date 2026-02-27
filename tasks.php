<?php
require 'cors.php';
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if ($user_id) {
        $stmt = $pdo->prepare("SELECT * FROM user_data WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll());
    }
} elseif ($method === 'POST') {
    // Create new task
    if(isset($data->user_id) && isset($data->title)) {
        $stmt = $pdo->prepare("INSERT INTO user_data (user_id, title, description, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data->user_id, $data->title, $data->description, 'pending']);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    }
} elseif ($method === 'PUT') {
    // Update task status
    if(isset($data->id) && isset($data->status)) {
        $stmt = $pdo->prepare("UPDATE user_data SET status = ? WHERE id = ?");
        $stmt->execute([$data->status, $data->id]);
        echo json_encode(["success" => true]);
    }
} elseif ($method === 'DELETE') {
    // Delete task
    // Note: In real apps, check if the task belongs to the user first!
    $id = $_GET['id'] ?? null;
    if($id) {
        $stmt = $pdo->prepare("DELETE FROM user_data WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    }
}
?>
