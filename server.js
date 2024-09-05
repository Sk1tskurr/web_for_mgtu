const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Ключ сгенерирован\n'+secretKey);

// Проверка и добавление строки в файл users.txt
const usersFilePath = path.join(__dirname, 'users.txt');
const adminCredentials = 'admin|defaultpassword';
fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
        if (err.code === 'ENOENT') {
            // Файл не существует, создаем и добавляем строку
            fs.writeFile(usersFilePath, adminCredentials + '\n', (err) => {
                if (err) throw err;
                console.log('Файл users.txt создан и строка добавлена.');
            });
        } else {
            throw err;
        }
    } else {
        // Файл существует, проверяем наличие строки
        if (!data.includes(adminCredentials)) {
            fs.appendFile(usersFilePath, adminCredentials + '\n', (err) => {
                if (err) throw err;
                console.log('Строка добавлена в файл users.txt.');
            });
        }
    }
});

// Получаем текущую дату и время
const now = new Date();
const formattedDate = now.toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}).replace(',', '');

// Константа для сравнения (без даты)
const baseInfo = '1|admin|Ну типа админ, да|';

// Формируем строку с использованием текущей даты и времени
const infoFilePath = path.join(__dirname, 'info.txt');
const infoFilling = `${baseInfo}${formattedDate}`;

fs.readFile(infoFilePath, 'utf8', (err, data) => {
    if (err) {
        if (err.code === 'ENOENT') {
            // Файл не существует, создаем и добавляем строку
            fs.writeFile(infoFilePath, infoFilling + '\n', (err) => {
                if (err) throw err;
                console.log('Файл info.txt создан и строка добавлена.');
            });
        } else {
            throw err;
        }
    } else {
        // Файл существует, проверяем наличие строки без учета даты
        const lines = data.split('\n');
        const exists = lines.some(line => line.startsWith(baseInfo));

        if (!exists) {
            fs.appendFile(infoFilePath, infoFilling + '\n', (err) => {
                if (err) throw err;
                console.log('Строка профиля admin добавлена в info.txt.');
            });
        }
    }
});


// Проверка наличия SESSION_SECRET и вывод сообщения
if (process.env.SESSION_SECRET) {
    console.log('Текущий ключ\n' + process.env.SESSION_SECRET);
}
// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Установите true, если используете HTTPS
}));

// Middleware для проверки авторизации
function checkAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Для обработки JSON и URL-кодированных данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Добавьте этот маршрут перед раздачей статических файлов
app.get('/session-data', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: 'Пользователь не авторизован' });
    }
});

// Раздача статических файлов
app.use(express.static(__dirname));


// Перенаправление с корневого URL на страницу логина
app.get('/', (req, res) => {
    res.redirect('/login');
});
// Маршрут для входа
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Обработка логина
app.post('/login', (req, res) => {
    const { login, password } = req.body;

    fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Ошибка сервера');
            return;
        }

        const users = data.split('\n').filter(line => line.trim() !== '');
        const userExists = users.some(user => {
            const [storedLogin, storedPassword] = user.split('|');
            return storedLogin === login && storedPassword === password;
        });

        if (userExists) {
            req.session.isAuthenticated = true;
            req.session.username = login; // Сохраняем логин в сессии
            res.json({ success: true, username: login, redirectUrl: '/main' });
        } else {
            res.json({ success: false, message: 'Неверный логин или пароль' });
        }
    });
});


// Маршрут для главной страницы (требует авторизации)
app.get('/main', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});


// Маршрут для выхода из системы
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Не удалось выйти из системы' });
        }
        res.clearCookie('connect.sid'); // Имя cookie может отличаться
        res.json({ success: true, redirectUrl: '/login' });
    });
});



// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
