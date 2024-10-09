const bcrypt = require('bcryptjs');
const database = require("../db/database.js"); // Assuming you have a database connection utility

const User = {
    // Create a new user
    createUser: async function(req, res) {
        const { username, password } = req.body;

        let db;

        try {
            // Connect to the 'jsramverk' database and the 'users' collection
            db = await database.getDb('jsramverk', 'users');

            // Hash the password before saving the user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user document
            const newUser = {
                username: username,
                password: hashedPassword,  // Save the hashed password
            };

            // Insert the user into the database
            await db.collection.insertOne(newUser);

            return res.status(201).json({ message: 'User created successfully' });
        } catch (e) {
            // Handle errors and send a 500 response
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "POST /users/create",
                    title: "Database error",
                    message: e.message,
                },
            });
        } finally {
            // Ensure the database connection is closed
            if (db) {
                await db.client.close();
            }
        }
    },

    // Compare password for login (optional, but useful)
    comparePassword: async function(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (err) {
            throw new Error('Error comparing passwords');
        }
    }
};

module.exports = User;
