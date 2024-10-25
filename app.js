const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const cors = require('cors');
const httpServer = require("http").createServer(app);

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

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinRoom', (documentId) => {
        socket.join(documentId);
    });

    socket.on('contentChange', ({ documentId, newContent }) => {
        socket.to(documentId).emit('updateContent', newContent);
    });

    socket.on('titleChange', ({ documentId, newTitle }) => {
        socket.to(documentId).emit('updateTitle', newTitle);
    });

    socket.on('addComment', ({ documentId, comments }) => {
        socket.to(documentId).emit('newComment', comments);
    });

    socket.on('removeComment', ({ documentId, comments }) => {
        socket.to(documentId).emit('deletedComments', comments);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

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
httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));
