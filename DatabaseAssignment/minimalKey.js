const fs = require('fs');
const express = require('express');
const prompt = require('prompt-sync')();
const { json } = require('body-parser');
const bodyParser = require('body-parser');
const { Console } = require('console');

const app = express();
app.use(bodyParser.json());

//global variables
let check = 0;
let leftSide = [];
let rightSide = [];
let relation = [];

// here json file is being read
function readJSONFile() {
    const content = fs.readFileSync('D:/Visual Studio/WebDev/DatabaseAssignment/data.json');
    let data = JSON.parse(content);
    relation = data.relation;
    let FDs = data.FDs;
    leftSide = Object.keys(FDs);
    rightSide = Object.values(FDs);
    minimalkey();
}

/* 
-> this method is used to find the closure of attribute
-> it takes an array as a parameter
-> compare method is invoked in this method to compare the closure with Main relation
-> if attributes of both are same, it is a candidate key and we display it
*/
function closure(left) {
    let fdArray = left;
    let result = [];
    for (let i = 0; i < fdArray.length; i++) {
        pushResult(fdArray[i], result);
        for (let j = 0; j < result.length; j++) {
            if (leftSide.includes(result[j])) {
                let ind = leftSide.indexOf(result[j]);
                pushResult(rightSide[ind], result);
            }
        }
        compare(result, fdArray[i]);
        result = [];
    }
}

/*
-> in this function, first leftSides of all dependencies are checked to confirm 
   if they are candidate key or not
-> if we don't find a candidate key, then we check the right side of all dependencies
-> by difference we find the attributes who are not present on right side but present in 
   main relation. they are pushed to an array
-> now we find closure for each of them and if we find a candidate key we display it
 */
function minimalkey() {
    closure(leftSide);
    if (check == 0) {}
    else {
        let right = rightSplit(rightSide);
        var rel = relation.trim().split(",");
        let diff = rel.filter(x => right.indexOf(x) === -1);
        let tempp = pairing(leftSide, diff);
        closure(tempp);
    }
}

// method to push attributes to result array
function pushResult(value, result) {
    let temp = [];
    if (value.includes(",")) temp = value.split(",");
    else temp = value.split("");
    for (let r = 0; r < temp.length; r++) {
        if (!result.includes(temp[r])) {
            result.push(temp[r]);
        }
    }
}

// method to compare the resultant and main relation. if both have same attributes, CK found else not
function compare(result, value) {
    var a = relation.trim().split(",");
    let b = result.sort();
    let ch = true;
    for (let f = 0; f < b.length; f++) {
        if (a[f] !== b[f]) ch = false;
    }
    if (ch) {
        check = 0;
        display(result, value);
    }
    else check = 1;
}

// method to display the minimal key
function display(result, value) {
    let res = "";
    for (let s = 0; s < result.length; s++) {
        res += result[s] + ", ";
    }
    console.log(`Minimal key -> ${value} = {${res.slice(0, -2)}}`);
}


// this method is used to split the attributes of rightSide of dependencies
function rightSplit(rightSide) {
    let temp = [];
    for (let r = 0; r < rightSide.length; r++) {
        let t = rightSide[r].split(",");
        for (let y = 0; y < t.length; y++) {
            temp.push(t[y]);
        }
    }
    return temp.sort();
}


// this method is used to pair the attributes when we fail to find CK from leftSide attribute of dependencies
function pairing(lef, diff) {
    let tem = [];
    for (let d = 0; d < lef.length; d++) {
        let temp = lef[d] + diff[0];
        tem.push(temp);
    }
    return tem;
}

readJSONFile();