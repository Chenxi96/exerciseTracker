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
  User1.save()
  
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
