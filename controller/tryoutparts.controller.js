const db = require("../model")
const fs = require("fs")
var formidable = require("formidable")
const { FILE_TEXT } = require("../assets/constants")
const readline = require("readline")

exports.upload = async (req, res) => {
  const filterDate = req.query.date
  const follow = req.query.follow
  const partNO = req.query.partNO
  console.log(req)
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    fs.readFile(files.file.filepath, "utf8", async (err, datafile) => {
      if (err) {
        console.error(err)
        return
      }
      const rows = datafile.split("\n")
      rows.pop()
      const convertArr = await processLineByLine(rows)
      const data = convertArr.map((e) => {
        const result = e.split("|")
        return result
      })
      const getTryoutParts = await db.tryoutparts.findAll()
      const result = data.map((e) => {
        const partNO = e[7].trim()
        const date = e[5].toString().split("/").reverse().join("/")
        const deliveryDate = date === filterDate ? filterDate : date
        return {
          partNO,
          partName: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.partName)[0],
          deliveryDate,
          quantity: parseFloat(e[8], 2),
          workGroup: e[13],
          receiveArea: e[10],
          follow: e[11],
          EO: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.EO)[0],
          CL: getTryoutParts
            .filter((e) => e.dataValues.partNO === partNO)
            .map((e) => e.CL)[0],
        }
      })
      result.pop()
      if (filterDate && follow && partNO) {
        res.send(result.filter((e) => e.deliveryDate === filterDate))
      } else if (filterDate && partNO) {
        res.send(result.filter((e) => e.deliveryDate === filterDate))
      } else if (partNO) {
        console.log("aaaaaaaaaaaaa", partNO)
        res.send(result.filter((e) => e.partNO === partNO))
      } else {
        res.send(result)
      }
    })
  })
}
const processLineByLine = async (rows) => {
  let arr = []
  for (const line of rows) {
    arr.push(line)
  }
  return arr
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
