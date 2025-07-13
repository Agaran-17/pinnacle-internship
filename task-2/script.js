const apiKey = "6d680efd3370ef90fc9dda923e404f4c";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const loader = document.getElementById("loader");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
    getForecast(city);
  }
});

function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  console.log("API URL:", apiUrl); // Just for checking

  loader.style.display = "block"; // Show loader
  weatherResult.innerHTML = "";   // Clear old data

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found or API key error");
      }
      return response.json();
    })
    .then(data => {
      showWeather(data);
    })
    .catch(error => {
      weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    })
    .finally(() => {
      loader.style.display = "none"; // Hide loader
    });
}

function showWeather(data) {
  const temperature = data.main.temp;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;

  // BONUS: Set background based on weather
  const condition = data.weather[0].main.toLowerCase();
  document.body.className = ""; // Remove old
  document.body.classList.add(condition);

  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <p><strong>Temperature:</strong> ${temperature} °C</p>
    <p><strong>Condition:</strong> ${description}</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind} m/s</p>
  `;
}

function getForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error fetching forecast");
      }
      return response.json();
    })
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      document.getElementById("forecastContainer").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function displayForecast(data) {
  const forecastEl = document.getElementById("forecastContainer");
  forecastEl.innerHTML = ""; // Clear old

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Noon only

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt);
    const icon = day.weather[0].icon;
    const temp = day.main.temp.toFixed(1);
    const desc = day.weather[0].description;

    forecastEl.innerHTML += `
      <div class="forecast-day">
        <h4>${date.toLocaleDateString("en-IN", { weekday: "short" })}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
        <p>${temp}°C</p>
        <p style="font-size: 0.8em">${desc}</p>
      </div>
    `;
  });
}

function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const formattedDate = now.toLocaleDateString("en-IN", options);
  document.getElementById("dateTime").textContent = formattedDate;
}

setInterval(updateDateTime, 1000);
updateDateTime();
