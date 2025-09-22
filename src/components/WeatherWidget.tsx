import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
}

const cities = [
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
];

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const results = await Promise.all(
          cities.map(async (c) => {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${c.lat}&lon=${c.lon}&appid=${API_KEY}&units=metric`
            );
            const data = await res.json();
            return {
              city: c.name,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            };
          })
        );
        setWeather(results);
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-battleship-gray text-sm italic opacity-70">
        loading...
      </div>
    );
  }

  return (
    <div className="flex gap-3 ml-3">
      {weather.map((w) => (
        <div
          key={w.city}
          className="flex items-center gap-1 group"
        >
          <span className="text-xs inter-medium text-battleship-gray group-hover:text-soft-royal-blue transition-all duration-200">
            {w.city}
          </span>
          <img
            src={w.icon}
            alt={w.condition}
            className="w-4 h-4 drop-shadow-[0_0_6px_rgba(94,122,255,0.5)]"
          />
          <span className="sg-bold text-sm text-soft-royal-blue group-hover:[text-shadow:0_0_8px_#5e7aff] transition-all duration-200">
            {w.temp}°
          </span>
        </div>
      ))}
    </div>
  );
}
