const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB");

const fruitSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

const Fruit = mongoose.model("fruit", fruitSchema);

const fruit = new Fruit({
    name: "Apple",
    rating: 7,
    review: "Pretty solid as a fruit"
});

//fruit.save();

// new document of people
const personSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Person = mongoose.model("Person", personSchema);
const person = new Person({
    name: 'Anees',
    age: 20
});

person.save();


// storing multiple fruits
const kiwi = new Fruit({
    name: "Kiwi",
    rating: 10,
    review: "The best kiwi"
});

const orange = new Fruit({
    name: "Orange",
    rating: 9,
    review: "Too sour"
});

const banana = new Fruit({
    name: "Banana",
    rating: 8,
    review: "Weird texture"
});

Fruit.insertMany([kiwi, orange, banana], (error) => {
    if (error) {
        console.error();
    }
    else {
        console.log("Successfully saved all the fruits to fruitsDB");
    }
})

