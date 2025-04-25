import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudFog, Wind, CloudLightning, Thermometer, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = "7d5e74e7b112e34001dc87b79a2fc7c3";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

type WeatherData = {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
};

const WeatherWidget = () => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const checkWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL + cityName + `&appid=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      
      setWeather({
        location: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].main,
        icon: data.weather[0].main.toLowerCase(),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like)
      });
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWeather(city);
  }, []);

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, JSX.Element> = {
      clear: <Sun className="h-10 w-10 text-yellow-400" />,
      clouds: <Cloud className="h-10 w-10 text-gray-400" />,
      rain: <CloudRain className="h-10 w-10 text-blue-400" />,
      snow: <CloudSnow className="h-10 w-10 text-blue-200" />,
      mist: <CloudFog className="h-10 w-10 text-gray-300" />,
      thunderstorm: <CloudLightning className="h-10 w-10 text-purple-400" />
    };

    return icons[condition.toLowerCase()] || <Cloud className="h-10 w-10 text-gray-400" />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    checkWeather(city);
    setIsSearchOpen(false);
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-lg overflow-hidden shadow-lg text-white relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">{weather?.location || 'Loading...'}</h3>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
              onSubmit={handleSearch}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {error ? (
          <div className="text-center py-4 text-red-200">{error}</div>
        ) : loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : weather && (
          <>
            <div className="flex items-center justify-between mb-6">
              {getWeatherIcon(weather.description)}
              <div className="text-right">
                <div className="text-4xl font-bold">{weather.temperature}°C</div>
                <div className="text-lg text-blue-100">{weather.description}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded p-2">
                <Thermometer className="h-4 w-4 mx-auto mb-1" />
                <span className="block text-xs text-blue-100">Feels Like</span>
                <span className="font-medium">{weather.feelsLike}°</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-2">
                <CloudRain className="h-4 w-4 mx-auto mb-1" />
                <span className="block text-xs text-blue-100">Humidity</span>
                <span className="font-medium">{weather.humidity}%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-2">
                <Wind className="h-4 w-4 mx-auto mb-1" />
                <span className="block text-xs text-blue-100">Wind</span>
                <span className="font-medium">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherWidget;