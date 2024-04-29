const express = require('express')
const app = express()
const port = 8000

const BestScore = require('./models/Bestscore');

let cors = require('cors')
app.use(cors());

require('dotenv').config()



const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

// Here in the database we only store only one best score document because we are implementing just a single user game and he can only have a single best score. It's an overkill to use a database for just this but I need to learn how to use mongoDB with react so
app.get('/bestscore', async (req, res) => {
    const bestScores = await BestScore.find();
    res.send(bestScores[0])
})


app.post('/bestscore', async (req, res) => {
    const newBestScore = new BestScore({
        bestScore: req.body.bestScore
    })
    await newBestScore.save();
    res.send(newBestScore)
})

app.patch("/bestscore/:id", async (req, res) => {
	try {
		const bestScore = await BestScore.findOne({ _id: req.params.id })
		if (req.body.bestScore) {
			bestScore.bestScore = req.body.bestScore
		}
		await bestScore.save()
		res.send(bestScore)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})


app.listen(port, () => console.log(`Server listening on port ${port}`))