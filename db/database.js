const mongo = require("mongodb").MongoClient;

const database = {
    getDb: async function getDb(dbName, collectionName) {
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.vqesk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;    // eslint-disable-line

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
