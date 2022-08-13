const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const {ids} = require("./secret.js");

const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/" + ids.listid;
    const options = {
        method: "POST",
        auth: "anees23:" + ids.appid
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else res.sendFile(__dirname + "/failure.html");

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}/`);
});