import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from './config';

function WeatherForecast() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = API_CONFIG.OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const fetchWeatherData = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather
      const currentResponse = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      setWeather(currentResponse.data);
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, BASE_URL]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a location if geolocation fails
          fetchWeatherData(40.7128, -74.0060); // New York as fallback
        }
      );
    } else {
      console.error('Geolocation not supported');
      fetchWeatherData(40.7128, -74.0060); // New York as fallback
    }
  }, [fetchWeatherData]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const getWeatherCondition = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return { condition: 'Thunderstorm', emoji: '⛈️', color: '#8B5CF6' };
    if (weatherId >= 300 && weatherId < 400) return { condition: 'Drizzle', emoji: '🌦️', color: '#3B82F6' };
    if (weatherId >= 500 && weatherId < 600) return { condition: 'Rain', emoji: '🌧️', color: '#1E40AF' };
    if (weatherId >= 600 && weatherId < 700) return { condition: 'Snow', emoji: '❄️', color: '#E5E7EB' };
    if (weatherId >= 700 && weatherId < 800) return { condition: 'Atmosphere', emoji: '🌫️', color: '#9CA3AF' };
    if (weatherId === 800) return { condition: 'Clear', emoji: '☀️', color: '#F59E0B' };
    if (weatherId > 800) return { condition: 'Clouds', emoji: '☁️', color: '#6B7280' };
    return { condition: 'Unknown', emoji: '❓', color: '#6B7280' };
  };

  const getBinAlertLevel = (weatherData) => {
    const { main, weather } = weatherData;
    const temp = main.temp;
    const humidity = main.humidity;
    const weatherId = weather[0].id;

    // Check for rain conditions
    if (weatherId >= 500 && weatherId < 600) {
      return {
        level: 'high',
        message: 'Heavy rain expected! Bins may overflow. Check bin levels immediately.',
        color: 'var(--warning-red)'
      };
    }

    // Check for high humidity and temperature
    if (humidity > 80 && temp > 25) {
      return {
        level: 'medium',
        message: 'High humidity and temperature. Monitor bins for odor and overflow.',
        color: 'var(--warning-orange)'
      };
    }

    // Check for extreme temperatures
    if (temp < 0 || temp > 35) {
      return {
        level: 'medium',
        message: 'Extreme temperature conditions. Check bin functionality.',
        color: 'var(--warning-orange)'
      };
    }

    return {
      level: 'low',
      message: 'Weather conditions are normal for bin operations.',
      color: 'var(--primary-green)'
    };
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-2xl)", textAlign: "center" }}>
        <div className="loading" style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>
          Loading weather data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-2xl)", textAlign: "center" }}>
        <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--space-lg)" }}>🌤️</div>
        <h2 style={{ color: "var(--warning-red)", marginBottom: "var(--space-md)" }}>Weather Data Unavailable</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)" }}>{error}</p>
        <button onClick={() => getCurrentLocation()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const weatherInfo = getWeatherCondition(weather.weather[0].id);
  const binAlert = getBinAlertLevel(weather);

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
      {/* Header */}
      <div className="fade-in-up" style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ 
          fontSize: "var(--font-size-4xl)", 
          fontWeight: "700", 
          margin: "0 0 var(--space-md) 0",
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Weather Forecast
        </h1>
        <p style={{ 
          fontSize: "var(--font-size-lg)", 
          color: "var(--text-secondary)",
          margin: "0"
        }}>
          Smart weather monitoring for optimal bin management
        </p>
      </div>

      {/* Current Weather */}
      <div className="card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-sm) 0", fontSize: "var(--font-size-xl)", color: "var(--text-primary)" }}>
              {weather.name}, {weather.sys.country}
            </h2>
            <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--space-sm)" }}>
              {weatherInfo.emoji}
            </div>
            <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
              {weather.weather[0].description}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-lg)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round(weather.main.temp)}°C
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Temperature</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--text-primary)" }}>
              {weather.main.humidity}%
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Humidity</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--text-primary)" }}>
              {weather.wind.speed} m/s
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Wind Speed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--text-primary)" }}>
              {weather.main.pressure} hPa
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Pressure</div>
          </div>
        </div>
      </div>

      {/* Bin Alert */}
      <div className="card" style={{ 
        padding: "var(--space-lg)", 
        marginBottom: "var(--space-lg)",
        background: binAlert.color === 'var(--warning-red)' ? 'var(--gradient-danger)' : 
                   binAlert.color === 'var(--warning-orange)' ? 'var(--gradient-warning)' : 'var(--gradient-primary)',
        color: 'var(--white)'
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ fontSize: "var(--font-size-2xl)" }}>
            {binAlert.level === 'high' ? '⚠️' : binAlert.level === 'medium' ? '⚡' : '✅'}
          </div>
          <div>
            <h3 style={{ margin: "0 0 var(--space-sm) 0", fontSize: "var(--font-size-lg)" }}>
              Bin Management Alert
            </h3>
            <p style={{ margin: "0", fontSize: "var(--font-size-sm)", opacity: 0.9 }}>
              {binAlert.message}
            </p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="card" style={{ padding: "var(--space-lg)" }}>
        <h3 style={{ 
          margin: "0 0 var(--space-lg) 0", 
          fontSize: "var(--font-size-xl)", 
          fontWeight: "600",
          color: "var(--text-primary)"
        }}>
          5-Day Forecast
        </h3>
        
        <div style={{ display: "grid", gap: "var(--space-md)" }}>
          {forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5).map((day, index) => {
            const dayWeather = getWeatherCondition(day.weather[0].id);
            const date = new Date(day.dt * 1000);
            
            return (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-md)",
                background: "var(--light-gray)",
                borderRadius: "var(--radius-md)",
                transition: "all var(--transition-fast)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--primary-green)";
                e.target.style.color = "var(--white)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--light-gray)";
                e.target.style.color = "var(--text-primary)";
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <div style={{ fontSize: "var(--font-size-lg)" }}>{dayWeather.emoji}</div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "var(--font-size-sm)" }}>
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-secondary)" }}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "600", fontSize: "var(--font-size-sm)" }}>
                    {Math.round(day.main.temp)}°C
                  </div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-secondary)" }}>
                    {day.weather[0].description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;
