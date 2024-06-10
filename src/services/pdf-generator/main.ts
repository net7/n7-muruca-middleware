const express = require("express");
const bodyParser = require("body-parser");

// import the createPDF function from the utils folder
const createPDFAuteso = require("./utils/auteso");
const createPDFCalderon = require("./utils/calderon");
const createPDFMemoram = require("./utils/memoram");

const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // temporarily allow all origins for testing purposes
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

app.get("/getPDF/:siteName/:id", (req, res) => {
  // depending on the sitename, it calls the corresponding function
  if (req.params.siteName === "auteso") {
    createPDFAuteso(req, res);
  } else if (req.params.siteName === "calderon") {
    createPDFCalderon(req, res);
  } else if (req.params.siteName === "memoram") {
    createPDFMemoram(req, res);
  } else {
    res.send({ status: 404, message: "Site not found" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});