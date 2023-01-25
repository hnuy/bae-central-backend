const materials = require("../controller/filterFactory.controller")

module.exports = (app) => {
    app.use((req,res,next) => {
        res.header(
            "Access-Control-Allow-Origin",
            "*",
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        )
        next()
    })
    app.post("/get/materials",materials)
}