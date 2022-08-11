const express = require("express");
const bodyparser = require("body-parser");

const app = express();
app.set('view engine', 'html');
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/bmiCalculator.html");
})

app.post("/bmiCalculator", (req, res) => {
    let weight = Number(req.body.weight);
    let height = Number(req.body.height);

    let result = (weight / (height * height));
    res.send("Your BMI is: " + result);
})
 
app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}/`);
})