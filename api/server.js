// require('dotenv').config()

// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')

// var cors = require('cors');
// app.use(cors);

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to Database'))

// app.use(express.json())



// const bestScoresRouter = require('./routes/bestScores')
// // app.use('/bestScores', bestScoresRouter)

// const BestScore = require('./models/bestScore')


// // Getting all
// app.get('/', async (req, res) => {
//   res.send('hello world')
// })

// app.listen(8000, () => console.log('Server Started'))



// const express = require('express')
// const app = express()
// const port = 1000

// var cors = require('cors');

// app.use(cors);

// app.get('/', (req, res) => {
//   res.send({bestScore: 100})
// })

// app.listen(port, () => console.log(`server listening on port ${port}`))

const express = require('express')
const app = express()
const port = 8000
let cors = require('cors')
app.use(cors());

require('dotenv').config()



const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())


app.get('/', (req, res) => {
res.send({BestScore: 100})
})

app.listen(port, () => console.log(`Server listening on port ${port}`))