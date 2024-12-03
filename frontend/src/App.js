import React, { useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function App() {
	
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
	
  const makeApiRequest = () => {
	  console.log('make api request');
	  axios('/api/testWithUser').then(respone => {
		  console.log("respone", respone);
	  })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Пожалуйста, заполните все поля!');
      return;
    }

    try {
      const response = await fetch('/auth/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Произошла ошибка при регистрации. Попробуйте позже.');
    }
  };
	
  return (
    <div /*className="App"*/>
      <header /*className="App-header"*/>
		<div className="container">
		  <h1>Регистрация</h1>
		  <form onSubmit={handleSubmit}>
			<label htmlFor="email">Email:</label><br />
			<input
			  type="email"
			  id="email"
			  value={email}
			  onChange={(e) => setEmail(e.target.value)}
			  placeholder="Введите Email"
			/><br /><br />

			<label htmlFor="password">Пароль:</label><br />
			<input
			  type="password"
			  id="password"
			  value={password}
			  onChange={(e) => setPassword(e.target.value)}
			  placeholder="Введите Пароль"
			/><br /><br />

			<button type="submit">Зарегистрироваться</button>
		  </form>
		  {message && <p>{message}</p>}
		</div>
      </header>
	  <button onClick={makeApiRequest}>Make api request</button>
    </div>
  );
}

export default App;
