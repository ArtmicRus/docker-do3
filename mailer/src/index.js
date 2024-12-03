const express = require('express');
const axios = require('axios');
const {port} = require("./configuration");

const app = express();
// Добавляем middleware для парсинга JSON-данных
app.use(express.json());


console.log('PORT', process.env.PORT);

app.listen(port, () => {
	console.log(`Start mailer service on port: ${port}`)
});

app.post('/api/send-email', (req, res) => {
	// Получаем email из тела запроса
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Поле "email" является обязательным!' });
    }

    console.log(`Отправка письма на почту: ${email}`);
    res.json({
        message: `Письмо успешно отправлено на почту: ${email}`,
    });
});