<?php
session_start();
require 'db.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получить все заметки пользователя
    $stmt = $db->prepare('SELECT id, title, content FROM notes WHERE user_id = ?');
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? '';
    $content = $data['content'] ?? '';
    $stmt = $db->prepare('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)');
    $stmt->execute([$user_id, $title, $content]);
    echo json_encode(['id' => $db->lastInsertId()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    $title = $data['title'] ?? '';
    $content = $data['content'] ?? '';
    $stmt = $db->prepare('UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$title, $content, $id, $user_id]);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    $stmt = $db->prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $user_id]);
    echo json_encode(['success' => true]);
    exit;
}
?>