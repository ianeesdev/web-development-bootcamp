const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'fruitsDB';

const client = new MongoClient(url);

client.connect((error) => {
    assert.equal(null, error);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    // insertDocuments(db, () => {
    //     client.close();
    // });
    findDocuments(db, () => {
        client.close();
    })
});

const insertDocuments = function(db, callback) {
    const collection = db.collection('fruits');
    collection.insertMany([
        {
            name: "Apple",
            score: 8,
            review: "Great fruit"
        }, 
        {
            name: "Orange",
            score: 6,
            review: "Kinda sour"
        }, 
        {
            name: "Banana",
            score: 9,
            review: "Great Stuff"
        }
    ], (err, result) => {
            assert.equal(err, null);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        }
    )
}

const findDocuments = (db, callback) => {
    const collection = db.collection('fruits');
    collection.find({}).toArray((err, fruits) => {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(fruits);
        callback(fruits);
    })
}