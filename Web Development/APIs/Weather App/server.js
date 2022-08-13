const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const {ids} = require("D:/Visual Studio/WebDev/Web Development/APIs/Newsletter-Signup/secret.js");

const app = express();
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const city = req.body.cityName;
    const appid = ids.weatherid;
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=${unit}`;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.write(`<p>The weather of ${weatherData.name} is currently ${weatherDescription}</p>`);
            res.write("<h1>The temperature is " + temp + "</h1>");
            res.write(`<img src="${iconUrl}" />`);
            res.send();
        })
    })
})

app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}/`);
});