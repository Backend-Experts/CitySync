const { MongoClient } = require("mongodb");

const uri = "mongodb://Sathwik:Sathwik123@docdb-2025-03-04-07-45-37sathwikdev.cluster-cromy02qozsg.us-east-1.docdb.amazonaws.com:27017/?ssl=true&retryWrites=false";
// try adding the cluster one if this doesnt work
const client = new MongoClient(uri, {
    sslValidate: false,  // AWS DocumentDB requires this
    useNewUrlParser: true,
    useUnifiedTopology: true
});

exports.handler = async (event) => {
    try {
        await client.connect();
        const db = client.db("myDatabase");
        const collection = db.collection("users");

        // Example: Fetch all users
        const allUsers = await collection.find({}).toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(allUsers),
        };
    } catch (error) {
        console.error("Error connecting to DocumentDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database connection failed" }),
        };
    } finally {
        await client.close();
    }
};

