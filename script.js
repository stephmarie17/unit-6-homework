// Array to hold search terms
var cityNames = [];
// Current day
let m = moment();

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

    getWeather(cityNames[cityNames.length -1])
}

// Function to handle event when search button clicked

$("#add-city").on("click", function(event) {
    event.preventDefault();

    var city = $("#city-input").val();
    if(city){
    // Add city to array of city names
    cityNames.push(city);
    $("#city-input").val("");

    storeSearches();
    }
    else {
        // alert('Please enter a city')
        var alert = $("<p>");
        alert.text("Please enter a city.");
        $("#search-history").append(alert);

    }
});

function getWeather(city) {
    if(typeof city === 'object'){
        city = $(this).attr("data-name");
    }
    currentWeather(city);
    fiveDayForecast(city);
}

// DOM manipulation to display search result for current weather
function currentWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=6a4885bca485162d035533a77b0473df";
    // AJAX call using search term cityName for current weather
    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        var weatherMain = $("<div class='current-weather'>");
        
        var date = m.format("MM/DD/YYYY");
        var h6 = $("<h6>").text(date);
        weatherMain.append(h6);

        var cityTitle = response.name;
        var h5One = $("<h5>").text(cityTitle);
        weatherMain.append(h5One);
        
        var iconValue = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconValue + ".png";
        var iconImg = $("<img>").attr("src", iconURL);
        weatherMain.append(iconImg);

        var temperature = response.main.temp;
        var pOne = $("<p>").text("Temperature: " + temperature + "°F");
        weatherMain.append(pOne);

        var humidity = response.main.humidity;
        var pTwo = $("<p>").text("Humidity: " + humidity + "%");
        weatherMain.append(pTwo);

        var windSpeed = response.wind.speed;
        var pThree = $("<p>").text("Wind Speed: " + windSpeed + " MPH")
        weatherMain.append(pThree);

        var lat = response.coord.lat;
        var lon = response.coord.lon;


        // New AJAX call for the UV Index
        function uvIndex() {
            var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=6a4885bca485162d035533a77b0473df";

            $.ajax({
                url: queryURL,
                method: "GET"
                }).then(function(response){

                // DOM manipulation to show UV Index
                var pFour = $("<p class='uv-index'>").text("UV Index: " + response.value);

                weatherMain.append(pFour);

                 $("#current-weather-display").html(weatherMain);
                })
        }
        uvIndex();
    });
}

// ISSUES: need to loop one time per day, add humidity and icon for each day, create a loop for DOM manipulation to clean up code

// AJAX call using search term cityName for five-day forecast
function fiveDayForecast(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&units=imperial&APPID=6a4885bca485162d035533a77b0473df";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
// DOM manipulation to display search results for five-day forecast
        var dailyTemps = [];
        for(var i = 0; i < response.list.length; i+=8){
            dailyTemps.push(response.list[i].main.temp);
        }
        
        for (var i =0; i < dailyTemps.length;i++) {
            var temp = dailyTemps[i];
            var parent = $("<div>");
            var child = $("<p>").text("Temp: " + temp + "°F");
            parent.append(child);
            $("#day-" + (i + 1).toString()).html(parent);
        }

        var dailyHumidity = [];
        for(var i = 0; i < response.list.length; i+=8) {
            dailyHumidity.push(response.list[i].main.humidity);
        }

        for (var i =0; i < dailyHumidity.length;i++) {
            var humidity = dailyHumidity[i];
            var parent = $("<div>");
            var child = $("<p>").text("Humidity: " + humidity + "%");
            parent.append(child);
            $("#day-" + (i + 1).toString()).append(parent);
        }

        var icons = [];
        for(var i = 0; i < response.list.length; i+=8) {
            icons.push(response.list[i].weather[0].icon);
        }

        for(var i = 0; i < icons.length; i++) {
            var icon = "https://openweathermap.org/img/w/" + icons[i] + ".png";
            var iconDisplay = $("<div>");
            var iconImg = $("<img>").attr("src", icon);
            iconDisplay.append(iconImg);
            $("#day-" + (i + 1)).append(iconImg);
        }
        function displayDates() {
            var fiveDays = [];
            var date = moment().format("MM/DD/YYYY");
            var date1 = moment().add(1,'d').format("MM/DD/YYYY");
            var date2 = moment().add(2,'d').format("MM/DD/YYYY");
            var date3 = moment().add(3,'d').format("MM/DD/YYYY");
            var date4 = moment().add(4,'d').format("MM/DD/YYYY");
        
            fiveDays.push(date, date1, date2, date3, date4);
            
            for(var i = 0; i < fiveDays.length; i++) {
                var eachDate = fiveDays[i];
                var dateDisplay = $("<div>");
                var eachDateDisplay = $("<p>").text(eachDate);
                dateDisplay.append(eachDateDisplay);
                $("#day-" + (i + 1)).append(eachDateDisplay);
            }
        }
        displayDates();
    });

}

// On click function so that users can click a search history term and see its response

$(document).on("click", ".city-btn", getWeather);

