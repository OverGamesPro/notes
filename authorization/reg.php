<?php
session_start();
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="autstyle.css">
    <title>Document</title>
</head>
<body>
    <?php if (!empty($message)): ?>
        <p style="color:white;"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <div class="windowreg">
        <div class="login">
            <form method="post" action="auntificator.php">
                <h1>Авторизация</h1>
                <input type="text" id="username" name="Login-username" placeholder="Имя пользователя" required>
                <input type="password" id="password" name="Login-password"  placeholder="Пароль" required>
                <button type="submit"  name="login">войти</button>
            </form>
        </div>
        <div class="register">
            <form method="post" action="auntificator.php">
                <h1>Регистрация</h1>
                <input type="text" id="username" name="Register-username" placeholder="Имя пользователя" required>
                <input type="email" id="email" name="email" placeholder="Электронная почта" required>
                <input type="password" id="password" name="Register-password" placeholder="Пароль" required>
                <button type="submit" name="register">Зарегистрироватся</button>    
            </form>
        </div>
    </div>
    
</body>
</html>