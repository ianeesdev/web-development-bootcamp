const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB");

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please check your values"] 
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    review: String
});

const Fruit = mongoose.model("fruit", fruitSchema);

// const fruit = new Fruit({
//     name: "Peach",
//     rating: 10,
//     review: "Pretty solid as a fruit"
// });

//fruit.save();

const mango = new Fruit({
    name: "Mango",
    rating: 10,
    review: "Decent fruit"
});

//mango.save();

// new document of people
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);
// const person = new Person({
//     name: 'Anees',
//     age: 20
// });

//person.save();


// storing multiple fruits
// const kiwi = new Fruit({
//     name: "Kiwi",
//     rating: 10,
//     review: "The best kiwi"
// });

// const orange = new Fruit({
//     name: "Orange",
//     rating: 9,
//     review: "Too sour"
// });

// const banana = new Fruit({
//     name: "Banana",
//     rating: 8,
//     review: "Weird texture"
// });

// insertion
// Fruit.insertMany([kiwi, orange, banana], (error) => {
//     if (error) {
//         console.error();
//     }
//     else {
//         console.log("Successfully saved all the fruits to fruitsDB");
//     }
// });

// find
Fruit.find((error, result) => {
    if (error) {
        console.error();
    }
    else {
        //mongoose.connection.close();
        result.forEach((fruit) => {
            console.log(fruit.name);
        })
    }
});

// update document
// Fruit.updateOne({_id: "62fc842010b02673b17135cd"}, {name: "Peach"}, (error) => {
//     if (error) {
//         console.error(error);
//     }
//     else {
//         console.log("Successfully updated the document.");
//     }
// });

// Delete document

// Fruit.deleteOne({_id: "62fc842010b02673b17135cd"}, (error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Successfully deleted the document!");
//     }
// });

Person.updateOne({name: "Anees"}, {favFruit: mango}, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Successfully updated the document.");
    }
})
