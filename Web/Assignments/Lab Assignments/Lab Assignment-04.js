$(document).ready(function() {
    // Animate Image
    $("#animate-btn").click(function(){
        // Animate the image's height and width
        $('.animate-img').animate({
            height: '250px',
            width: '280px'
        });
    });
    $("#reset-btn").click(function(){
        // Animate the image's height and width
        $('.animate-img').animate({
            height: '150px',
            width: '180px'
        });
    });

    // Hide and Show Message
    $("#hide").click(function(){
        $("#msg").hide(5000);
      });
    $("#show").click(function(){
        $("#msg").show(5000);
    });

    // Toogle Message Hide and Show
    $("#toogle").click(function(){
        $("#message").toggle('slow');
    });

    // Fade in and Fade out Message
    $("#fade-in").click(function(){
        $("#msg-fade").fadeIn('fast');
      });
    $("#fade-out").click(function(){
        $("#msg-fade").fadeOut('fast');
    });

    // Toggle Message Fade In and Fade Out
    $("#toogle-fade").click(function(){
        $("#fade-msg").fadeToggle('slow');
    });

    // Fade To Message
    $("#fadeToMsg").click(function(){
        $("#fadeMsg").fadeTo('slow', 0.7);
    });

    // Toogle Message Slide
    $("#flip").click(function(){
        $("#panel").slideToggle('slow');
    });

    // Chaining
    $("#chaining").click(function(){
        $("#p1").css("color", "orange").slideUp('slow').slideDown('fast');
    });
});