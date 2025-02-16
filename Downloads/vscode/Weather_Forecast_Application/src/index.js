document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = '30407a57253c80217c82b6b2bcf1ffa6'; 
    const searchBtn = document.getElementById("search_Btn");
    const locationBtn = document.getElementById("locationBtn");
    const cityInput = document.getElementById("cityInput");
    const recentSearches = document.getElementById("recentSearches");
    const forecastContainer = document.getElementById("forecastContainer");

    // Function to fetch weather data
    async function fetchWeather(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
            const data = await response.json();

            if (response.ok) {
                displayCurrentWeather(data);
                fetchForecast(data.coord.lat, data.coord.lon);
                saveRecentSearch(city);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Failed to fetch data. Check your internet connection.");
        }
    }

    // Function to fetch 5-day forecast
    async function fetchForecast(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const data = await response.json();
            displayForecast(data.list);
        } catch (error) {
            console.error("Error fetching forecast data", error);
        }
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        document.getElementById("cityName").textContent = `${data.name} (${new Date().toISOString().split('T')[0]})`;
        document.getElementById("weatherDesc").textContent = data.weather[0].description;
        document.getElementById("temperature").textContent = data.main.temp;
        document.getElementById("windSpeed").textContent = data.wind.speed;
        document.getElementById("humidity").textContent = data.main.humidity;

        document.getElementById("currentWeather").classList.remove("hidden");
    }

    // Function to display 5-day forecast
    function displayForecast(forecastData) {
        forecastContainer.innerHTML = "";

        for (let i = 0; i < forecastData.length; i += 8) { // Get one forecast per day
            const day = forecastData[i];
            const date = day.dt_txt.split(" ")[0];
            const temp = day.main.temp;
            const wind = day.wind.speed;
            const humidity = day.main.humidity;

            const card = `
                <div class="bg-gray-800 text-white p-3 rounded-lg">
                    <p class="text-lg font-semibold">${date}</p>
                    <p>🌡️ Temp: ${temp}°C</p>
                    <p>💨 Wind: ${wind} m/s</p>
                    <p>💧 Humidity: ${humidity}%</p>
                </div>
            `;
            forecastContainer.innerHTML += card;
        }
    }

    // Function to get user location
    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                alert("Location access denied.");
            }
        );
    }

    // Function to fetch weather by coordinates
    async function fetchWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const data = await response.json();

            displayCurrentWeather(data);
            fetchForecast(lat, lon);
        } catch (error) {
            console.error("Error fetching location-based weather", error);
        }
    }

    // Function to save recent searches
    function saveRecentSearch(city) {
        let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        if (!searches.includes(city)) {
            searches.push(city);
            localStorage.setItem("recentSearches", JSON.stringify(searches));
            updateRecentSearches();
        }
    }

    // Function to update recent searches dropdown
    function updateRecentSearches() {
        let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        recentSearches.innerHTML = '<option value="">Recent Searches</option>';
        searches.forEach(city => {
            let option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            recentSearches.appendChild(option);
        });
        recentSearches.classList.remove("hidden");
    }

    // Event Listeners
    searchBtn.addEventListener("click", () => {
        if (cityInput.value) fetchWeather(cityInput.value);
    });

    locationBtn.addEventListener("click", getLocation);

    recentSearches.addEventListener("change", function () {
        if (this.value) fetchWeather(this.value);
    });

    // Initialize recent searches
    updateRecentSearches();

    searchBtn.addEventListener("click", ()=>{
        console.log("Clicked");
    })

});