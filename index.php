<?php
session_start();
if (empty($_SESSION['username'])) {
    header('Location:/authorization/reg.php');
    exit;
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="workplace.css">
    <link rel="stylesheet" href="note.css">
    <link rel="stylesheet" href="texholder.css">
    
    <title>Document</title>
</head>
<body>
    <button class="naxui">все удалить</button>
    <div class="main">   <!--панель отображения моих заметок-->
        <div class="workplace-header">   
            <button class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"><path d="m16 22-1-4"/><path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1"/><path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z"/><path d="m8 22 1-4"/></svg></button>
        </div>
        <div class="workplace"></div>
    </div>
    <div class="modal hidden">   <!--это скрытое окно самой заметки-->
        <div class="modal-content">
            <button id="exit">x</button>
            <input type="text" id="note-title" placeholder="Заголовок" />
            <textarea id="note-content" placeholder="Содержание..."></textarea>
            <button id="save-note">Сохранить</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>