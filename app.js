const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const cors = require('cors');
//const morgan = require('morgan');

require('./config/passport');
require('dotenv').config();

const data = require("./routes/data.js");
const authRoutes = require('./routes/auth.js');
const mgRoutes = require('./routes/mailgun.js');

const port = process.env.PORT || 8080;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Add a route
app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "JS Backend API",
        }
    };

    res.json(data);
});

app.use("/data", data);
app.use('/auth', authRoutes);
app.use('/mailgun', mgRoutes);

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
