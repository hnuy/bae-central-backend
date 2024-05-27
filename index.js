const serverless = require("serverless-http");
const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cors = require("cors");
app.use(cors());

const db = require("./model");

db.sequelize.sync();

const fs = require("fs");
var formidable = require("formidable");

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/partno", async function (req, res) {
  try {
    const data = await db.tryoutparts.findAll();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});
app.get("/get/partNO", async function (req, res) {
  try {
    const data = await db.tryoutparts.findAll();
    res.send(data);
  } catch (error) {
    res.send(error.errors[0].message);
  }
});
app.get("/materials", async function (req, res) {
  try {
    const data = await db.material.findAll();
    res.send(data);
    // res.send(data.map((e) => e.dataValues).map((e) => e.partNO))
  } catch (error) {
    res.send(error.message);
  }
});
app.post("/upload", (req, res) => {
  const filterDate = req.query.date;
  const partNo = req.query.partNo;
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    fs.readFile(files.file.filepath, "utf8", async (err, datafile) => {
      if (err) {
        console.error(err);
        return;
      }
      const rows = datafile.split("\n");
      rows.pop();
      const convertArr = await processLineByLine(rows);
      const data = convertArr.map((e) => {
        const result = e.split("|");
        return result;
      });
      const getTryoutParts = await db.tryoutparts.findAll();
      const result = data.map((e) => {
        const partNo = e[7].trim();
        const date = e[5].toString().split("/").reverse().join("/");
        const deliveryDate = date === filterDate ? filterDate : date;
        return {
          partNo: partNo,
          partName: getTryoutParts
            .filter((e) => e.dataValues.partNo === partNo)
            .map((e) => e.partName)[0],
          deliveryDate,
          quantity: parseFloat(e[8], 2),
          workGroup: e[13],
          receiveArea: e[10],
          EO: getTryoutParts
            .filter((e) => e.dataValues.partNo === partNo)
            .map((e) => e.EO)[0],
          CL: getTryoutParts
            .filter((e) => e.dataValues.partNo === partNo)
            .map((e) => e.CL)[0],
        };
      });
      result.pop();
      if (filterDate && partNo) {
        res.send(
          result.filter(
            (e) => e.deliveryDate === filterDate && e.partNo === partNo
          )
        );
      } else if (filterDate) {
        res.send(result.filter((e) => e.deliveryDate === filterDate));
      } else if (partNo) {
        res.send(result.filter((e) => e.partNo === partNo));
      } else {
        res.send(result);
      }
    });
  });
});
const processLineByLine = async (rows) => {
  let arr = [];
  for (const line of rows) {
    arr.push(line);
  }
  return arr;
};

module.exports.handler = serverless(app);
