import { Users, Droplets, Coffee, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import WeatherCard from '../components/WeatherCard';
import PredictionCard from '../components/PredictionCard';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const { weatherData, footfallData, isLoading, error } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-error-500">{error}</div>
      </div>
    );
  }
  
  if (!weatherData || !footfallData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">No data available. Please refresh the page.</div>
      </div>
    );
  }
  
  // Calculate statistics
  const totalCustomers = footfallData.daily.reduce((sum, day) => sum + day.predictedCustomers, 0);
  const avgDailyCustomers = Math.round(totalCustomers / footfallData.daily.length);
  const peakDay = [...footfallData.daily].sort((a, b) => b.predictedCustomers - a.predictedCustomers)[0];
  const peakHour = [...footfallData.hourly].sort((a, b) => b.customers - a.customers)[0];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Today's Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Predicted Customers Today" 
            value={footfallData.daily[0].predictedCustomers}
            icon={<Users className="h-5 w-5 text-secondary-500" />}
            change={{ 
              value: "12%", 
              positive: true 
            }}
          />
          
          <StatCard 
            title="Weather Impact" 
            value={footfallData.daily[0].weatherImpact === 'positive' ? 'Positive' : footfallData.daily[0].weatherImpact === 'negative' ? 'Negative' : 'Neutral'}
            icon={<Droplets className="h-5 w-5 text-blue-500" />}
          />
          
          <StatCard 
            title="Peak Service Hour" 
            value={`${peakHour.hour}:00`}
            icon={<Coffee className="h-5 w-5 text-primary-500" />}
            change={{ 
              value: `${peakHour.customers} customers`, 
              positive: true 
            }}
          />
          
          <StatCard 
            title="Week's Peak Day" 
            value={peakDay.day}
            icon={<TrendingUp className="h-5 w-5 text-accent-500" />}
            change={{ 
              value: `${peakDay.predictedCustomers} customers`, 
              positive: true 
            }}
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <WeatherCard weather={weatherData.current} isToday />
          
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="text-lg font-medium mb-3">Hourly Traffic Today</h3>
            <div className="space-y-3">
              {footfallData.hourly.slice(0, 5).map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between">
                  <div className="text-gray-700">{hour.hour}:00</div>
                  <div className="flex-1 mx-4">
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full"
                        style={{ width: `${(hour.customers / Math.max(...footfallData.hourly.map(h => h.customers))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="font-medium">{hour.customers}</div>
                </div>
              ))}
              <div className="text-center text-sm text-secondary-600 hover:underline cursor-pointer mt-2">
                Show all hours
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {weatherData.forecast.slice(0, 6).map((day) => (
            <WeatherCard key={day.day} weather={day} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Weekly Footfall Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {footfallData.daily.map((prediction) => (
            <PredictionCard key={prediction.day} prediction={prediction} />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-card p-4 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1 rounded-full bg-success-500 h-2 w-2"></div>
            <p className="text-gray-700">Weather forecast shows {weatherData.forecast.filter(day => day.condition === 'Sunny' || day.condition === 'Partly Cloudy').length} good weather days this week, expect higher than average footfall.</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 rounded-full bg-warning-500 h-2 w-2"></div>
            <p className="text-gray-700">{weatherData.forecast.filter(day => day.condition === 'Rain').length > 0 ? `Rain expected on ${weatherData.forecast.filter(day => day.condition === 'Rain').map(day => day.day).join(' and ')}, prepare for 15-20% lower walk-in traffic.` : 'No rain expected this week, favorable for outdoor seating.'}</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 rounded-full bg-primary-500 h-2 w-2"></div>
            <p className="text-gray-700">Average daily customers expected: {avgDailyCustomers}, prepare inventory accordingly.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;