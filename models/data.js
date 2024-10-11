const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAllDocuments: async function (res, req) {    // eslint-disable-line
        let db;

        try {
            db = await database.getDb("jsramverk", "dokument");
            let results = await db.collection.find({}).toArray();

            res.send(results).status(200);
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    path: "/data",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    getSpecificDocument: async function (res, req, id) {
        let db;

        try {
            db = await database.getDb("jsramverk", "dokument");
            let results = await db.collection.findOne({_id: ObjectId(id)});

            res.send(results).status(200);
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    path: "/data",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    createData: async function(res, req) {
        const { title, content, username } = req.body;

        let db;

        try {
            db = await database.getDb("jsramverk", "dokument");

            const newDocument = {
                title: title,
                content: content,
                owner: username,
                contributors: [],
                created_at: new Date(),
            };

            await db.collection.insertOne(newDocument);

            return res.status(201).send();
        } catch (e) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "POST /data INSERT",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    updateData: async function (res, req) {
        if (req.body.id) {
            const { id, title, content } = req.body;
            let db;

            try {
                db = await database.getDb("jsramverk", "dokument");

                await db.collection.updateOne(
                    { _id: ObjectId(id) },
                    { $set: { title, content } }
                );

                return res.status(204).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "PUT /data UPDATE",
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "PUT /data no id",
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    },

    deleteData: async function (res, req) {
        if (req.body.id) {
            let _id = req.body.id;

            let filter = {
                "users.data._id": ObjectId(_id)
            };

            let deleteDoc = {
                $pull: {
                    "users.$.data": {
                        "_id": ObjectId(_id)
                    }
                }
            };

            let db;

            try {
                db = await database.getDb();

                await db.collection.updateOne(filter, deleteDoc);

                return res.status(204).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "DELETE /data DELETE",
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "PUT /data no id",
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    }
};

module.exports = data;
