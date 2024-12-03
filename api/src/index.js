const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const {connectDb} = require("./helpers/db");


const {host, port, db, authApiUrl} = require("./configuration");

const postSchema = new mongoose.Schema({
	name: String
});

const Post = mongoose.model('Post', postSchema);

const startServer = () => {
	app.listen(port, () => {
		console.log(`Start api service on port: ${port}`)
		console.log(`Start api service on HOST: ${host}`)
		console.log(`Start api service on database: ${db}`)
		
		//Post.find(function(err, posts) {
			//if (err) return console.error(err);
			//console.log('posts', posts);
		//});
		
		const silence = new Post({ name: "Silence" });
		
		silence.save()
		  .then(savedSilence => {
			console.log('savedSilence new test volumes', savedSilence);
		  })
		  .catch(err => {
			console.error(err);
		  });
	});
}

console.log('PORT', process.env.PORT);

app.get('/api/test', (req, res) => {
	res.send('Our api server Работает');
});

app.get('testapidata', (req, res) => {
	res.json({
		testwithapi: true
	});
});

app.get('/testWithUser', (req, res) => {
	axios.get(authApiUrl + '/currentUser').then(response => {
		res.json({
			testWithUser: true,
			currentUserFromAuth: response.data
		});
	});
});

connectDb()
  .on('error', console.log)
  .on('disconnected', connectDb)
  .once('open', startServer);