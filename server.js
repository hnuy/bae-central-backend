const express = require("express")
const app = express()

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var cors = require("cors")
app.use(cors())

const db = require("./model")

db.sequelize.sync()

app.get("/", function (req, res) {
  res.send("Hello World")
})
require("./routes/tryoutparts.routes")(app)

app.listen(3003, (req, res) => {
  console.log("Server is up and listening on 3003")
})
