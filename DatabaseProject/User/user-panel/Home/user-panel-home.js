const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow,i) => {
    const itemNumber = movieLists[i].querySelectorAll(".item-img").length;
    let clickCounter = 0;
    arrow.addEventListener("click",() =>{
        clickCounter++;
        console.log(itemNumber);
        if (itemNumber - (4+clickCounter) >= 0){
            movieLists[i].style.transform = `translateX(${
                movieLists[i].computedStyleMap().get("transform")[0].x.value-275}px)`;
        }
        else{
            movieLists[i].style.transform = `translateX(0)`;
            clickCounter=0;
        }
    })
    console.log();
})