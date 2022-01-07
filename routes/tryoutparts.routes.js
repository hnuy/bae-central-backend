const tryoutparts = require("../controller/tryoutparts.controller")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get("/get/tryoutparts", tryoutparts.allData)
  app.get("/get/generateGreenTag", tryoutparts.generateGreenTag)
  app.post("/get/upload", tryoutparts.upload)
}
