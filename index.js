const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

try {
  mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB is Connected')
} catch (e) {
  console.log(e)
}

const UsersSchema = new mongoose.Schema({
  username: String
})

const ExerciseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
  description: String,
  duration: Number,
  date: Date
})

const User = mongoose.model('User', UsersSchema)
const Exercise = mongoose.model('Exercise', ExerciseSchema)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({
  extended: true
}))

app.post('/api/users', (req, res) => {
  const User1 = new User({
    username: req.body.username
  })
  User1.save()
  User.findOne({username: req.body.username}).then((user) => {
    res.json({
      username: user.username,
      _id: user._id
    })
  })
});

app.get('/api/users', (req, res) => {
  User.find({}).then((users) => {
    res.json(users)
  })
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const Exercise1 = new Exercise({
    _id: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  })
  Exercise1.save()
  
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
