const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user.js');
const database = require('../db/database.js');
const dotenv = require('dotenv');
dotenv.config();

// Local strategy for logging in with username and password
passport.use(new LocalStrategy(async (username, password, done) => {
    let db;

    try {
        // Connect to the database and fetch the user
        db = await database.getDb('jsramverk', 'users');
        const user = await db.collection.findOne({ username: username });

        // If user not found, return an error
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        // If everything is correct, return the user object
        return done(null, user);
    } catch (err) {
        return done(err);
    } finally {
        // Ensure the database connection is closed
        if (db) {
            await db.client.close();
        }
    }
}));

// JWT strategy for verifying the JWT token
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env.SECRET_KEY}`,  // Ensure you set a secret in a config or environment variable
}, async (jwtPayload, done) => {
    let db;

    console.log("coming to passport.js");

    try {
        // Connect to the database and fetch the user by ID from the JWT payload
        db = await database.getDb('jsramverk', 'users');
        const user = await db.collection.findOne({ _id: ObjectId(jwtPayload.id) });

        if (!user) {
            return done(null, false);
        }

        // Return the user object if the token is valid
        return done(null, user);
    } catch (err) {
        return done(err, false);
    } finally {
        // Ensure the database connection is closed
        if (db) {
            await db.client.close();
        }
    }
}));
