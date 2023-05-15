const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()


  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(e => console.log(e));

const UsersSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: { type: Date, default: Date.now() }
    }
  ]
});


const User = mongoose.model('User', UsersSchema)

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
  let update = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  }

  User
    .findOneAndUpdate({_id: req.params._id}, {$push: {log: update}, $inc: {count: 1}}, {new: true})
    .then((user) => {
    res.json({
      _id: user._id,
      username: user.username,
      description: user.log[0].description,
      duration: user.log[0].duration,
      date: user.log[0].date.toDateString()
    })
  }).catch(err => {
    console.log(err)
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
