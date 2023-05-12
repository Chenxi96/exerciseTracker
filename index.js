const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()


  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(e => console.log(e));

const UsersSchema = new mongoose.Schema({
  username: String
})

const ExerciseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now() }
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
  User1.save().then((user) => {
    res.json({
      username: user.username,
      _id: user._id
    })
  })
});

app.get('/api/users', (req, res) => {
    User.find({}).then((users) => {
      res.json(users)
    }).catch((err) => {
      console.log(err)
    })
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const exercise = new Exercise({
    user_id: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  })
  exercise.save().then((exercise) => {
    User.findById(exercise.user_id).then((user) => {
      res.json({
        _id: exercise.user_id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
      })
    })
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
