
$(document).ready(function() {
    
    var sodaUrl = "https://data.wa.gov/resource/xc42-c7rk.json";
    
    $.support.cors = true;
    $.getJSON(sodaUrl)
    .done(function(data) {
        
        console.log("Got it!");
        
    });
});