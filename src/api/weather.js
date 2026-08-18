// src/api/weather.js

const parseWMOCode = (code) => {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'clouds';
  if (code === 45 || code === 48) return 'clouds'; // fog
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'rain'; // thunderstorm
  return 'clear';
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 7) return 'sunrise';
  if (hour > 7 && hour < 17) return 'day';
  if (hour >= 17 && hour <= 19) return 'sunset';
  return 'night';
};

export const fetchLiveWeather = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported. Using fallback weather.");
      resolve({ condition: 'clear', timeOfDay: getTimeOfDay(), temp: 25 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
          
          const res = await fetch(url);
          const data = await res.json();
          const current = data.current_weather;
          
          resolve({
            condition: parseWMOCode(current.weathercode),
            timeOfDay: getTimeOfDay(),
            temp: current.temperature,
            isDay: current.is_day === 1
          });
        } catch (e) {
          console.error("Weather fetch failed", e);
          resolve({ condition: 'clear', timeOfDay: getTimeOfDay(), temp: 25 });
        }
      },
      (error) => {
        console.warn("Geolocation denied or failed. Using fallback.", error);
        resolve({ condition: 'clear', timeOfDay: getTimeOfDay(), temp: 25 });
      },
      { timeout: 5000 }
    );
  });
};
