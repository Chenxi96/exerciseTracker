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
      date: Date
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
      description: update.description,
      duration: update.duration,
      date: update.date? new Date(update.date).toDateString() : Date.now()
    })
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/users/:_id/logs', (req, res) => {
  User.findById(req.params._id).then(user => {
    const logs = () => {
      let log = []
      for(let i=0; i<user.log.length; i++) {
        log.push({
          description: user.log[i].description,
          duration: user.log[i].duration,
          date: new Date(user.log[i].date).toDateString()
        })
      }
      return log
    }
    res.json({
      username: user.username,
      _id: user._id,
      count: user.count,
      log: logs()
    })
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
