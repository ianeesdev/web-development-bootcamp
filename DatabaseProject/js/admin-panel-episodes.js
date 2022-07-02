//Sidebar toggle

function openNav() {
    document.getElementById("myNav").style.width = "35%";
  }
  
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }


  // Upload and Display image
  const image_input = document.querySelector("#image-input");
image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

// Multi-select-plugin

