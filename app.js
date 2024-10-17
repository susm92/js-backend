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
const socketPORT = process.env.SOCKET_PORT || 3030;

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

    // Handle joining a room
    socket.on('joinRoom', (documentId) => {
        socket.join(documentId); // Join the specified room
    });

    // Listening for content changes from a user
    socket.on('contentChange', ({ documentId, newContent }) => {
        // Broadcast the updated content to other users in the same document room
        socket.to(documentId).emit('updateContent', newContent);
    });

    // Listening for title changes from a user
    socket.on('titleChange', ({ documentId, newTitle }) => {
        // Broadcast the updated title to other users in the room
        socket.to(documentId).emit('updateTitle', newTitle);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

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

io.listen(socketPORT);
console.log(`Socket.IO server is running on port ${socketPORT}`);
