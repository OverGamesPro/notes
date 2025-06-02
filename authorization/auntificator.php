<?php
session_start();
require 'db.php';

$message = '';

if (isset($_POST['register'])) {
    $username = trim($_POST['Register-username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['Register-password'] ?? '';

    if ($username && $email && $password) {
        // Проверяем, есть ли уже такой пользователь
        $stmt = $db->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $message = 'Пользователь с таким именем или email уже существует.';
        } else {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $db->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
            if ($stmt->execute([$username, $email, $passwordHash])) {
                $_SESSION['username'] = $username;
                header('Location: /index.php');
                exit;
            } else {
                $message = 'Ошибка при регистрации.';
            }
        }
    } else {
        $message = 'Заполните все поля.';
    }
}

// Обработка входа
if (isset($_POST['login'])) {
    $username = trim($_POST['Login-username'] ?? '');
    $password = $_POST['Login-password'] ?? '';

    if ($username && $password) {
        $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            header('Location: /index.php');
            exit;
        } else {
            $message = 'Неверное имя пользователя или пароль.';
        }
    } else {
        $message = 'Заполните все поля.';
    }
}
?>
