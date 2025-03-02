import { useState } from "react";
import backgroundImage from './assets/background.jpg';

// API configuration
const api = {
  key: "d5f7545ac41a25c2c0f5255ec34edd63", // API key
  base: "https://api.openweathermap.org/data/2.5/", // OpenWeather API base URL
};

const App = () => {
  // State hooks for search query, current weather, and forecast data
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);


  const searchPressed = () => {
    // Fetch current weather data
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result); // Set the current weather data to the state
      });

    // Fetch 5-day forecast data
    fetch(`${api.base}forecast?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((data) => {
        const dailyForecast = [];
        // Extract forecast data for the next 5 days
        for (let i = 0; i < data.list.length; i += 8) {
          const day = data.list[i];
          dailyForecast.push({
            dayOfWeek: new Date(day.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            }), // Get the short weekday name
            temp: day.main.temp,
            icon: day.weather[0].icon, // Weather icon code
            description: day.weather[0].description, // Weather description
          });
        }
        setForecast(dailyForecast); // Set the forecast data to the state
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchPressed(); // Trigger the search when "Enter" is pressed
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
      }}
    >
      <header className="text-center bg-white p-6 rounded-lg shadow-lg w-200 h-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Weather App</h1>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Enter City"
            className="p-2 border border-gray-300 rounded-l-md w-full"
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={handleKeyPress} 
          />
          <button
            onClick={searchPressed} 
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* If weather data is available, display the weather information */}
        {typeof weather.main !== "undefined" ? (
          <div className="text-gray-700">
            <p className="text-2xl font-semibold">
              {weather.name}, {weather.sys.country}
            </p>

            {/* Weather Icon */}
            <div className="flex justify-center my-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-24 h-24"
              />
            </div>

            {/* Temperature in Celsius */}
            <p className="text-xl">{weather.main.temp}°C</p>

            {/* Weather Condition (e.g., Sunny) */}
            <p className="text-md font-medium">{weather.weather[0].main}</p>
            <p className="text-sm text-gray-500">
              ({weather.weather[0].description}) 
            </p>

            {/* Wind Speed */}
            <p className="text-md mt-2">
              Wind: {weather.wind.speed} m/s
            </p>

            {/* Humidity */}
            <p className="text-md mt-2">
              Humidity: {weather.main.humidity}%
            </p>
          </div>
        ) : (
          // If weather data is not available, display a message
          <p className="text-gray-500 mt-4">
            Enter a city to get the weather info.
          </p>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-xl font-semibold">{day.dayOfWeek}</p> {/* Day of the week */}
                  <div className="flex justify-center my-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="text-lg">{day.temp}°C</p> {/* Temperature */}
                  <p className="text-sm text-gray-500">{day.description}</p> {/* Weather description */}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
