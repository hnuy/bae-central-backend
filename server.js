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

app.get("/get/partNO", async function (req, res) {
  try {
    const data = await db.tryoutparts.findAll()
    res.send(data.map((e) => e.dataValues).map((e) => e.partNO))
  } catch (error) {
    res.send(error.errors[0].message)
  }
})
app.get("/materials", async function (req, res) {
  try {
    const data = await db.materials.findAll()
    res.send(data)
    // res.send(data.map((e) => e.dataValues).map((e) => e.partNO))
  } catch (error) {
    res.send(error.errors[0].message)
  }
})
require("./routes/tryoutparts.routes")(app)

app.listen(3004, (req, res) => {
  console.log("Server is up and listening on 3004")
})
