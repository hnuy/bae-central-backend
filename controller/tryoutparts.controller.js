const db = require("../model");
const fs = require("fs");
var formidable = require("formidable");

exports.upload = async (req, res) => {
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
          event: e[e.length - 2],
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
};
const processLineByLine = async (rows) => {
  let arr = [];
  for (const line of rows) {
    arr.push(line);
  }
  return arr;
};

exports.insertMat = async (req, res) => {
  try {
    const data = await db.tryoutparts.create({
      partNo: req.body.addPartNO,
      partName: req.body.partName,
      EO: req.body.EO,
      CL: req.body.CL,
    });
    res.send(data);
  } catch (error) {
    res.send(error.errors[0].message);
  }
};
