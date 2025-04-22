import { useState } from 'react';
import { Calendar, ChevronDown, ArrowRight, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Forecast = () => {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { weatherData, footfallData, isLoading, error } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading forecast data...</div>
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
        <div className="text-gray-500">No forecast data available.</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Footfall Forecast</h1>
          <p className="text-gray-500">Predict customer traffic based on weather patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Calendar className="h-4 w-4 mr-2" />
              {viewType === 'daily' && 'Daily View'}
              {viewType === 'weekly' && 'Weekly View'}
              {viewType === 'monthly' && 'Monthly View'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium">Detailed Forecast</h2>
            
            <div className="flex space-x-1 text-sm">
              <button
                onClick={() => setViewType('daily')}
                className={`px-3 py-1 rounded-md ${viewType === 'daily' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewType('weekly')}
                className={`px-3 py-1 rounded-md ${viewType === 'weekly' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewType('monthly')}
                className={`px-3 py-1 rounded-md ${viewType === 'monthly' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {viewType === 'daily' && (
            <div>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Hourly Breakdown</h3>
                <div className="space-y-3">
                  {footfallData.hourly.map((hour) => (
                    <div key={hour.hour} className="flex items-center">
                      <div className="w-16 text-sm text-gray-600">{hour.hour}:00</div>
                      <div className="flex-1 mx-4">
                        <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-secondary-500 rounded-l-md flex items-center px-2 text-xs text-white font-medium transition-all duration-500 ease-in-out"
                            style={{ 
                              width: `${(hour.customers / Math.max(...footfallData.hourly.map(h => h.customers))) * 100}%`,
                              minWidth: '40px'
                            }}
                          >
                            {hour.customers}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-24 flex items-center text-sm">
                        {hour.hour >= 8 && hour.hour <= 9 && (
                          <div className="flex items-center text-success-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Morning Rush
                          </div>
                        )}
                        {hour.hour >= 12 && hour.hour <= 13 && (
                          <div className="flex items-center text-success-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Lunch Peak
                          </div>
                        )}
                        {hour.hour >= 14 && hour.hour <= 15 && (
                          <div className="flex items-center text-error-500">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            Afternoon Lull
                          </div>
                        )}
                        {hour.hour >= 17 && hour.hour <= 18 && (
                          <div className="flex items-center text-success-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            After Work
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Hourly Staffing Recommendations</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">6:00 - 8:00</span>
                        <span className="text-sm font-medium">1-2 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">8:00 - 10:00</span>
                        <span className="text-sm font-medium">3-4 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">10:00 - 12:00</span>
                        <span className="text-sm font-medium">2-3 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">12:00 - 14:00</span>
                        <span className="text-sm font-medium">3-4 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">14:00 - 16:00</span>
                        <span className="text-sm font-medium">2 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">16:00 - 18:00</span>
                        <span className="text-sm font-medium">2-3 staff members</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">18:00 - 20:00</span>
                        <span className="text-sm font-medium">1-2 staff members</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Weather Impact Analysis</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-full bg-white shadow-sm">
                        <Users className="h-5 w-5 text-secondary-500" />
                      </div>
                      <div>
                        <div className="text-lg font-medium">{footfallData.daily[0].predictedCustomers}</div>
                        <div className="text-sm text-gray-500">Predicted customers today</div>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                        <span className="text-sm">{weatherData.current.temp}°F temperature will have {weatherData.current.temp > 65 && weatherData.current.temp < 75 ? 'a positive' : 'a moderate'} impact on foot traffic.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                        <span className="text-sm">{weatherData.current.condition} conditions typically {weatherData.current.condition === 'Sunny' || weatherData.current.condition === 'Partly Cloudy' ? 'increase' : 'decrease'} walk-in traffic.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                        <span className="text-sm">Peak hours will be 8:00-10:00 and 12:00-14:00.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {viewType === 'weekly' && (
            <div>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Weekly Customer Traffic</h3>
                <div className="h-60 bg-gray-50 rounded-lg flex items-end p-4">
                  {footfallData.daily.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="relative w-full max-w-[40px] group">
                        <div 
                          className="w-full bg-secondary-500 rounded-t-md transition-all duration-300 group-hover:bg-secondary-600"
                          style={{ 
                            height: `${(day.predictedCustomers / Math.max(...footfallData.daily.map(d => d.predictedCustomers))) * 100}%`,
                          }}
                        ></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.predictedCustomers} customers
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">{day.day.substring(0, 3)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <h3 className="text-md font-medium">Weekly Forecast Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Traffic</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Staff</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {footfallData.daily.map((day, index) => (
                        <tr key={day.day} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.day}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {weatherData.forecast[index]?.temp}°F, {weatherData.forecast[index]?.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{day.predictedCustomers}</span>
                              <span className="ml-2">
                                {day.weatherImpact === 'positive' && <TrendingUp className="h-4 w-4 text-success-500" />}
                                {day.weatherImpact === 'negative' && <TrendingDown className="h-4 w-4 text-error-500" />}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                                  <div 
                                    className={`h-full rounded-full ${
                                      day.confidence >= 85 ? 'bg-success-500' : 
                                      day.confidence >= 70 ? 'bg-warning-500' : 'bg-error-500'
                                    }`}
                                    style={{ width: `${day.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{day.confidence}%</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.ceil(day.predictedCustomers / 100)} - {Math.ceil(day.predictedCustomers / 80)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {viewType === 'monthly' && (
            <div className="flex justify-center items-center h-60 text-gray-500">
              Monthly data visualization will appear here.
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Forecast Influencing Factors</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-md font-medium">Weather Impact</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-medium">High Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-4/5 bg-primary-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Precipitation</span>
                  <span className="font-medium">Very High Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-11/12 bg-primary-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wind</span>
                  <span className="font-medium">Low Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-1/4 bg-primary-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">Seasonal Factors</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Day of Week</span>
                  <span className="font-medium">High Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-4/5 bg-secondary-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Month</span>
                  <span className="font-medium">Medium Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-3/5 bg-secondary-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Holidays</span>
                  <span className="font-medium">Very High Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-11/12 bg-secondary-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">Business Factors</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Promotions</span>
                  <span className="font-medium">Medium Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-3/5 bg-accent-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Events Nearby</span>
                  <span className="font-medium">High Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-4/5 bg-accent-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Competitors</span>
                  <span className="font-medium">Low Impact</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-full w-1/4 bg-accent-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;