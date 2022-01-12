const db = require("../model")
const fs = require("fs")
var formidable = require("formidable")
const { FILE_TEXT } = require("../assets/constants")
const readline = require("readline")

exports.upload = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    var oldPath = files.file.filepath
    var newPath2 = FILE_TEXT + files.file.originalFilename
    fs.rename(oldPath, newPath2, async function (err) {
      if (err) throw err
      async function processLineByLine() {
        const fileStream = fs.createReadStream(
          `./fileText/${files.file.originalFilename}`
        )
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        })
        let arr = []
        for await (const line of rl) {
          arr.push(line)
        }
        return arr
      }
      const convertArr = await processLineByLine()
      const data = convertArr.map((e) => {
        const result = e.split("|")
        return result
      })
      const getTryoutParts = await db.tryoutparts.findAll()
      const result = data.map((e) => {
        const partNO = e[7].trim()
        const deliveryDate = e[5].toString().split("/").reverse().join("/")
        return {
          partNO,
          partName: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.partName)[0],
          deliveryDate,
          quantity: parseFloat(e[8], 2),
          workGroup: e[13],
          receiveArea: e[10],
          EO: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.EO)[0],
          CL: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.CL)[0],
        }
      })
      result.pop()
      fs.unlinkSync(newPath2)
      res.send(result)
    })
  })
}

exports.insertMat = async (req, res) => {
  try {
    const data = await db.tryoutparts.create({
      partNO: req.body.partNO,
      partName: req.body.partName,
      EO: req.body.EO,
      CL: req.body.CL,
    })
    res.send(data)
  } catch (error) {
    res.send(error.errors[0].message)
  }
}
