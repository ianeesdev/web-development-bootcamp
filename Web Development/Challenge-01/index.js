let randomNum1 = Math.floor(Math.random() * 6) + 1;
let imageSource1 = "images/dice" + randomNum1 + ".png";
document.querySelector(".img1").src = imageSource1;

let randomNum2 = Math.floor(Math.random() * 6) + 1;
let imageSource2 = "images/dice" + randomNum2 + ".png";
document.querySelector(".img2").src = imageSource2;

if (randomNum1 > randomNum2) {
    document.querySelector("h1").textContent = "🚩 Player One Won!";
}
else if (randomNum1 == randomNum2) {
    document.querySelector("h1").textContent = "Draw"
}
else {
    document.querySelector("h1").textContent = "Player Two Won! 🚩";
}