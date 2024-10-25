const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user.js');
const database = require('../db/database.js');
const dotenv = require('dotenv');

dotenv.config();

passport.use(new LocalStrategy(async (username, password, done) => {
    let db;

    try {
        db = await database.getDb('jsramverk', 'users');
        const user = await db.collection.findOne({ username: username });

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const isMatch = await User.comparePassword(password, user.password);

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    } finally {
        if (db) {
            await db.client.close();
        }
    }
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env.SECRET_KEY}`,
}, async (jwtPayload, done) => {
    let db;

    try {
        db = await database.getDb('jsramverk', 'users');
        const user = await db.collection.findOne({ _id: ObjectId(jwtPayload.id) });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    } finally {
        if (db) {
            await db.client.close();
        }
    }
}));
