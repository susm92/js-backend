const bcrypt = require('bcryptjs');
const database = require("../db/database.js");

const User = {
    createUser: async function(req, res) {
        const { username, password } = req.body;

        let db;

        try {
            db = await database.getDb('jsramverk', 'users');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                username: username,
                password: hashedPassword,
            };

            await db.collection.insertOne(newUser);

            return res.status(201).json({ message: 'User created successfully' });
        } catch (e) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "POST /users/create",
                    title: "Database error",
                    message: e.message,
                },
            });
        } finally {
            if (db) {
                await db.client.close();
            }
        }
    },
    comparePassword: async function(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (err) {
            throw new Error('Error comparing passwords');
        }
    }
};

module.exports = User;
