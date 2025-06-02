<?php
// Создаём (или открываем) файл базы данных SQLite
$db = new PDO('sqlite:./database.sqlite');

// Включаем режим выброса исключений
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Создаём таблицу users, если её ещё нет
$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
)");
