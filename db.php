<?php
// backend/db.php

$host = 'localhost';
$db_name = 'user_dashboard_db';
$username = 'root'; // Default XAMPP/WAMP username
$password = '';     // Default XAMPP/WAMP password (usually empty)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    // Enable exceptions for errors
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Return objects by default
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
