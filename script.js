// Array to hold search terms
var cityNames = [];

// Function for DOM manipulation to get search term & display search history

function storeSearches() {
    $("#search-history").empty();

    for (var i = 0; i < cityNames.length; i++) {
        var cityBtn = $("<button>");
        cityBtn.addClass("city-btn");
        cityBtn.attr("data-name", cityNames[i]);
        cityBtn.text(cityNames[i]);
        $("#search-history").append(cityBtn);
    }

}

// Function to handle event when search button clicked

$("#add-city").on("click", function(event) {
    event.preventDefault();
    var city = $("#city-input").val();

    // Add city to array of city names
    cityNames.push(city);

    storeSearches();
})

// DOM manipulation to display search result for current weather
function currentWeather() {

    var city = $(this).attr("data-name");
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=6a4885bca485162d035533a77b0473df";
    // AJAX call using search term cityName for current weather
    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        var weatherMain = $("<div class='current-weather'>");

        var cityTitle = response.name;
        var h5One = $("<h5>").text(cityTitle);

        weatherMain.append(h5One);

        // var date = response.timezone;
        // var h5Two = $("<h5>").text(date);

        // weatherMain.append(h5Two);
        
        var iconWeather = response.weather.icon;
        var h5Three = $("<p>").text(iconWeather);

        weatherMain.append(h5Three);

        var temperature = response.main.temp;
        var pOne = $("<p>").text("Temperature: " + temperature + "°F");

        weatherMain.append(pOne);

        var humidity = response.main.humidity;
        var pTwo = $("<p>").text("Humidity: " + humidity + "%");

        weatherMain.append(pTwo);

        var windSpeed = response.wind.speed;
        var pThree = $("<p>").text("Wind Speed: " + windSpeed + " MPH")

        weatherMain.append(pThree);

        // var uvIndex = 

        $("#current-weather-display").append(weatherMain);
    });
}

// AJAX call using search term cityName for five-day forecast

function fiveDayForecast() {
    var city = $(this).attr("data-name");
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&units=imperial&APPID=6a4885bca485162d035533a77b0473df";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
// DOM manipulation to display search results for five-day forecast
    });
}


// On click function so that users can click a search history term and see its response

$(document).on("click", ".city-btn", currentWeather);
$(document).on("click", ".city-btn", fiveDayForecast);

storeSearches();

