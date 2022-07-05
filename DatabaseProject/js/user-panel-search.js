// Slider for movies/series

const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow,i) => {
    const itemNumber = movieLists[i].querySelectorAll(".item-img").length;
    let clickCounter = 0;
    arrow.addEventListener("click",() =>{
        console.log("clicked");
        clickCounter++;
        console.log(itemNumber);
        if (itemNumber - (4+clickCounter) >= 0){
            movieLists[i].style.transform = `translateX(${
                movieLists[i].computedStyleMap().get("transform")[0].x.value-260}px)`;
        }
        else{
            movieLists[i].style.transform = `translateX(0)`;
            clickCounter=0;
        }
    })
    console.log();
})


// Sidebar overlay for movies/series
function openNav() {
    console.log("Open");
    document.getElementById("myNav").style.width = "35%";
  }
  
  function closeNav() {
    console.log("Close");
    document.getElementById("myNav").style.width = "0%";
  }

// Changing send button
document.getElementById('add-to-playlist').onclick= change;
function change(){
  this.value ="Video added!";
  this.style.backgroundColor="green";
}