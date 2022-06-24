const fs = require('fs');
const express = require('express');
const prompt = require('prompt-sync')();
const { json } = require('body-parser');
const bodyParser = require('body-parser');
const { Console } = require('console');

const app = express();
app.use(bodyParser.json());

function split(value) {
    let temp = value.split("");
    return temp[0] + (Number(temp[1]) + 1);
}

console.log(split("P5"));