const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
//const morgan = require('morgan');

require('dotenv').config();

const data = require("./routes/data.js");

const port = 3030;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add a route
app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

app.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

app.use("/data", data);

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
