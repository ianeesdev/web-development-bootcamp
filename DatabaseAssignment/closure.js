const fs = require('fs');
const express = require('express');
const prompt = require('prompt-sync')();
const { json } = require('body-parser');
const bodyParser = require('body-parser');
const { Console } = require('console');

const app = express();
app.use(bodyParser.json());

// main method in which json file is being read and values are stored in variables
function readJSONFile() {
    const content = fs.readFileSync('D:/Visual Studio/WebDev/DatabaseAssignment/data.json');
    let data = JSON.parse(content);
    let relation = data.relation;
    let FDs = data.FDs;
    closure(relation, FDs);
}

/* 
-> closure function is used to find the closure of attributes.
-> the data from main function is used here and left and right side of dependencies 
   are saved separately in arrays.
-> User input of attributes is saved in variable fdArray and main loop runs till the length 
   of user input array
-> condition checks if user input is present on the left side of any dependency or not.
-> if condition is valid, the right side of that dependency is added to the result array.
-> pushResult method is used to push the attributes in the result array.
-> inside loop runs till the length of result array and inside this loop there is a condition.
-> if any attribute that is present in result array is on the left side of dependency, the right 
   side of dependency is also added in the result array.
-> after this loop ends, display method is called to show the closure of this particular attribute.
-> the outer loop then checks the next attribute and above steps are repeated.
*/
function closure(relation, fds) {
    var result = [];
    const fdArray = userInput();
    let leftSide = Object.keys(fds);
    let rightSide = Object.values(fds);
    console.log(`Relation: ${relation}`);
    for (let i = 0; i < fdArray.length; i++) {
        if (leftSide.includes(fdArray[i])) {
            let fd = leftSide.indexOf(fdArray[i]);
            pushResult(leftSide[fd], result);
            pushResult(rightSide[fd], result);
            for (let j = 0; j < result.length; j++) {
                if (leftSide.includes(result[j])) {
                    let ind = leftSide.indexOf(result[j]);
                    pushResult(rightSide[ind], result);
                }
            }
        }
        display(result, fdArray[i]);
        result = [];
    }
}

function pushResult(value, result) {
    let temp = value.split(",");
    for (let r = 0; r < temp.length; r++) {
        if (!result.includes(temp[r])) {
            result.push(temp[r]);
        }
    }
}

function display(result, value) {
    let res = "";
    for (let s = 0; s < result.length; s++) {
        res += result[s] + ", ";
    }
    console.log(`Closure of attribute ${value} : {${res.slice(0, -2)}}`);
}

function userInput() {
    var name = prompt("Enter attributes separated by a comma: ").trim();
    name = name.split(",");
    return name;
}
readJSONFile();