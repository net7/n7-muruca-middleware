const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    // temporarily allow all origins for testing purposes
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
