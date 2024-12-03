const express = require('express');
const axios = require('axios');
const User = require('./models/User.js'); // Импортируем модель пользователя

const app = express();
app.use(express.json());

const {connectDb} = require("./helpers/db");

const {host, port, db, apiUrl, mailerApiUrl} = require("./configuration");



const startServer = () => {
	app.listen(port, () => {
		console.log(`Start auth service on port: ${port}`)
		console.log(`Start auth service on HOST: ${host}`)
		console.log(`Start auth service on database: ${db}`)
	});
}

console.log('PORT', process.env.PORT);

// Маршрут для регистрации нового пользователя
app.post('/register', async (req, res) => {
    try {
		const { email, password } = req.body;

        // Проверка наличия обязательных полей
        if (!email || !password) {
            return res.status(400).send({ error: 'Поля электронной почты и пароля являются обязательными.' });
        };

        // Поиск пользователя по email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ error: 'Такой пользователь уже существует' });
        };

        const newUser = new User({ email, password });
        await newUser.save();
		
        //const response = await axios.get(apiUrl + '/test', {
		//  headers: {
		//	'Content-Type': 'application/json',
		//  },
		//});
        //const userData = response.data;
        //console.log(userData); // Здесь вы можете работать с полученными данными

        // Отправка письма через mailerApiUrl
        //const response2 = await axios.post(
          //`${mailerApiUrl}/send-email`,
          //{ email: email }, // Данные передаются в теле запроса
          //{ headers: { 'Content-Type': 'application/json' } } // Добавляем заголовок Content-Type
        //);
		
		 const response = await axios.post(
			mailerApiUrl + '/send-email', // URL конечной точки
			{ email: email },                 // Данные, которые передаются в теле запроса
			{ headers: { 'Content-Type': 'application/json' } } // Заголовок, сообщающий серверу, что данные в формате JSON
		  );
		 
		const data = response.data;
        console.log(data); // Здесь вы можете работать с полученными данными

        // Формирование ответа клиенту
        res.status(201).send({ message: `Регистрация прошла успешно. ${response.data.message}.` });    
	} catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при регистрации' });
    }
});


app.get('/test', (req, res) => {
	res.send('Our auth server Работает');
});

app.get('/api/testwithapidata', (req, res) => {
	axios.get(apiUrl + "/testapidata").then(response => {
		res.json({
			testapidata: response.data.testwithapi
		});
	});
});

app.get('/api/currentUser', (req, res) => {
	res.json({
		id: "1234",
		email: "foo@tandex.com"
	});
});



connectDb()
  .on('error', console.log)
  .on('disconnected', connectDb)
  .once('open', startServer);