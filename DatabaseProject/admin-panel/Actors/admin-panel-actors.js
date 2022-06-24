function openNav() {
  console.log("Open");
  document.getElementById("myNav").style.width = "35%";
}

function closeNav() {
  console.log("Close");
  document.getElementById("myNav").style.width = "0%";
}

const image_input = document.querySelector("#image-input");
image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});