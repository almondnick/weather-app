var APIkey = '5d45c7f127ae4b138f89effa224e3d03';
var searchBtn = document.getElementById("searchBtn");

var listOfCities = [];
if(localStorage.getItem("history")) {
    listOfCities = JSON.parse(localStorage.getItem("history"))
}

function performSearch () {
    var inputVal = document.getElementById("cityToSearch").value.trim();
    listOfCities.push(inputVal)
    localStorage.setItem('history', JSON.stringify(listOfCities));
    weatherSearch(inputVal)
    forecastSearch(inputVal)
}

function weatherSearch(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    fetch(queryURL)
    .then(function(result) {
        return result.json()
    })
    .then(function (data) {
        var weatherIcon = document.getElementById('weather-icon');
        var dataIcon = data.weather[0].icon
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dataIcon}.png`)
        var cityName = document.getElementById("city-name");
        cityName.textContent = data.name;
        var today = dayjs().format('MM/DD/YYYY');
        document.getElementById("current-date").textContent = today
        document.getElementById("temp").textContent = "Temp: " + data.main.temp + " \u00B0F";
        document.getElementById("wind").textContent = "Wind: " + data.wind.speed + " MPH";
        document.getElementById("humid").textContent = "Humidity: " + data.main.humidity + "%";
        renderHistory()
    })
}

searchBtn.addEventListener("click", performSearch);

function forecastSearch() {
    var userInput = document.getElementById('cityToSearch').value.trim();
    futureWeatherSearch(userInput);
}

function futureWeatherSearch(cityName) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIkey}&units=imperial`
    fetch(queryURL)
    .then(function(result) {
        return result.json()
    })
    .then(function(data) {
        console.log(data)
        var arrOfTimes = data.list; 
        var arrOfFilteredTimes = [];
        for(i=0; i< arrOfTimes.length; i++) {
            if(arrOfTimes[i].dt_txt.split(" ")[1] == "12:00:00") {
                arrOfFilteredTimes.push(arrOfTimes[i])
            }
        }
        renderForecast(arrOfFilteredTimes)
    })    
}

function renderForecast(arr) {
    for(i =0; i<arr.length; i++) {
        var givenDate = arr[i].dt_txt.split(" ")[0]
        var properDate = givenDate.split('-');
        console.log(properDate)
        document.getElementById("date-" + i).textContent = properDate[1] + "/" + properDate[2] + "/" + properDate[0]
        document.getElementById("icon-" + i).innerHTML = `<img src="https://openweathermap.org/img/wn/${arr[i].weather[0].icon}.png"/>`
        document.getElementById("temp-" + i).textContent = "Temp: " + arr[i].main.temp + " \u00B0F"
        document.getElementById("wind-" + i).textContent = "Wind: " + arr[i].wind.speed + " MPH"
        document.getElementById("humid-" + i).textContent = "Humidity:" + arr[i].main.humidity + "%"
    }
}

function renderHistory() {
    document.getElementById("history").innerHTML = "";
    for(i=0; i<listOfCities.length; i++) {
        var newBtn = document.createElement("button")
        newBtn.textContent = listOfCities[i];
        newBtn.addEventListener("click", function(e) {
            weatherSearch(e.target.textContent)
            futureWeatherSearch(e.target.textContent)
        })
        document.getElementById("history").append(newBtn)
    }
}

renderHistory()