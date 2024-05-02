require('dotenv').config()
const express = require('express')
const port = 3000

const BestScore = require('./models/Bestscore');

let cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json())

app.listen(port, () => console.log(`Server listening on port ${port}`))


const mongoUrl = process.env.MONGO_URI

const mongoose = require('mongoose')
const http2 = require('http2');


try {
	const client = http2.connect('https://www.google.com');
	client.on('connect', () => {
		mongoose.connect(mongoUrl).catch(err => {
			console.log('database conneciton error:');
		});
		
	});

const db = mongoose.connection


app.get('/internet_connection', (req, res) => {
	const client = http2.connect('https://www.google.com');
	client.on('connect', () => {
		// console.log('connected to the internet');
		res.send({connection: true})
	});
	client.on('disconnect', () => {
		console.log('disconnected from the internet');
		res.send({connection: false})
	});
	client.on('error', err =>{
		console.log('disconnected from the internet')
		res.send({connection: false})	
	});
});


db.on('error', (error) => {
	console.log('Database error: ')
}

)
db.on('disconnect', () => {
		// db.close();
		console.log('disconnected from Database')
	}
);

db.on('connected', () => {
		console.log('Connected to Database')
		// Here in the database we only store only one best score document because we are implementing just a single user game and he can only have a single best score. It's an overkill to use a database for just this but I need to learn how to use mongoDB with react so
		app.get('/bestscore', async (req, res) => {
			try {
				const bestScores = await BestScore.find();
			if(bestScores.length > 0){
				res.send(bestScores[0])
			}
			else{
				res.send({bestScore: -1})
			}
			} catch (error) {
				console.log(error)
			}
			
		})


		app.post('/bestscore', async (req, res) => {
			try {
				const newBestScore = new BestScore({
					bestScore: req.body.bestScore
				})
				await newBestScore.save();
				res.send(newBestScore)
			} catch (error) {
				console.log(error)
			}
		})

		app.patch("/bestscore/:id", async (req, res) => {
			try {
				const bestScore = await BestScore.findOne({ _id: req.params.id })
				if (req.body.bestScore) {
					bestScore.bestScore = req.body.bestScore
				}
				await bestScore.save()
				res.send(bestScore)
			} catch(err) {
				res.status(404)
				res.send({ error: err })
			}
		})

});


} catch (error) {
	console.error(error);ç
}