import { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { format, subDays } from 'date-fns';

const History = () => {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'custom'>('30days');
  const { footfallData, isLoading, error } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading historical data...</div>
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
  
  if (!footfallData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">No historical data available.</div>
      </div>
    );
  }
  
  // Get display data based on selected date range
  const getHistoricalData = () => {
    if (dateRange === '7days') {
      return footfallData.historical.slice(-7);
    }
    return footfallData.historical;
  };
  
  const displayData = getHistoricalData();
  
  // Calculate metrics
  const totalCustomers = displayData.reduce((sum, day) => sum + day.actualCustomers, 0);
  const avgDailyCustomers = Math.round(totalCustomers / displayData.length);
  const maxDay = [...displayData].sort((a, b) => b.actualCustomers - a.actualCustomers)[0];
  const minDay = [...displayData].sort((a, b) => a.actualCustomers - b.actualCustomers)[0];
  
  // Calculate week-over-week change
  const currentWeekTotal = displayData.slice(-7).reduce((sum, day) => sum + day.actualCustomers, 0);
  const previousWeekTotal = displayData.slice(-14, -7).reduce((sum, day) => sum + day.actualCustomers, 0);
  const weekOverWeekChange = previousWeekTotal ? Math.round((currentWeekTotal - previousWeekTotal) / previousWeekTotal * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Historical Footfall</h1>
          <p className="text-gray-500">Analyze past customer traffic patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date Range
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-card p-4 shadow-card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
          <p className="text-2xl font-semibold">{totalCustomers.toLocaleString()}</p>
          <div className="mt-1 flex items-center text-xs">
            <span className={weekOverWeekChange >= 0 ? 'text-success-500' : 'text-error-500'}>
              {weekOverWeekChange >= 0 ? '+' : ''}{weekOverWeekChange}%
            </span>
            <span className="text-gray-500 ml-1">vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-card p-4 shadow-card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Daily Average</h3>
          <p className="text-2xl font-semibold">{avgDailyCustomers}</p>
          <div className="mt-1 text-xs text-gray-500">
            customers per day
          </div>
        </div>
        
        <div className="bg-white rounded-card p-4 shadow-card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Peak Day</h3>
          <p className="text-2xl font-semibold">{maxDay.actualCustomers}</p>
          <div className="mt-1 text-xs text-gray-500">
            on {format(new Date(maxDay.date), 'MMM d')}
          </div>
        </div>
        
        <div className="bg-white rounded-card p-4 shadow-card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Slowest Day</h3>
          <p className="text-2xl font-semibold">{minDay.actualCustomers}</p>
          <div className="mt-1 text-xs text-gray-500">
            on {format(new Date(minDay.date), 'MMM d')}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium">Customer Traffic Over Time</h2>
            
            <div className="flex space-x-1 text-sm">
              <button
                onClick={() => setDateRange('7days')}
                className={`px-3 py-1 rounded-md ${dateRange === '7days' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange('30days')}
                className={`px-3 py-1 rounded-md ${dateRange === '30days' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange('custom')}
                className={`px-3 py-1 rounded-md ${dateRange === 'custom' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="h-60 bg-gray-50 rounded-lg flex items-end p-4 pt-6 relative">
            {/* Y-axis labels */}
            <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-4">
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>
            
            {displayData.map((day, index) => {
              const maxValue = Math.max(...displayData.map(d => d.actualCustomers));
              const heightPercentage = (day.actualCustomers / maxValue) * 100;
              const date = new Date(day.date);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="relative w-full max-w-[30px]">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 ${
                        isWeekend ? 'bg-secondary-400' : 'bg-secondary-500'
                      }`}
                      style={{ 
                        height: `${heightPercentage}%`,
                      }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.actualCustomers} customers on {format(date, 'MMM d')}
                    </div>
                  </div>
                  {(index % 5 === 0 || index === displayData.length - 1) && (
                    <div className="mt-2 text-xs text-gray-500">{format(date, 'MMM d')}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Detailed Historical Data</h2>
            <button className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Count</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vs. Average</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vs. Previous Week</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayData.map((day, index) => {
                const date = new Date(day.date);
                const dayName = format(date, 'EEEE');
                const vsAverage = Math.round((day.actualCustomers / avgDailyCustomers - 1) * 100);
                
                // Calculate vs previous week (same day of week)
                let vsPrevWeek = null;
                if (index >= 7) {
                  const prevWeekDay = displayData[index - 7];
                  vsPrevWeek = Math.round((day.actualCustomers / prevWeekDay.actualCustomers - 1) * 100);
                }
                
                return (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(date, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{day.actualCustomers}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${vsAverage >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                          {vsAverage >= 0 ? '+' : ''}{vsAverage}%
                        </span>
                        <span className="ml-2">
                          {vsAverage >= 0 ? <TrendingUp className="h-4 w-4 text-success-500" /> : <TrendingDown className="h-4 w-4 text-error-500" />}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vsPrevWeek !== null ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${vsPrevWeek >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                            {vsPrevWeek >= 0 ? '+' : ''}{vsPrevWeek}%
                          </span>
                          <span className="ml-2">
                            {vsPrevWeek >= 0 ? <TrendingUp className="h-4 w-4 text-success-500" /> : <TrendingDown className="h-4 w-4 text-error-500" />}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Key Insights</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3">Weekly Pattern</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Weekends (Saturday and Sunday) consistently see 25-40% higher traffic than weekdays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Monday is typically the slowest weekday, with approximately 15% less traffic than the weekday average.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Friday afternoons show a significant uptick, suggesting potential for happy hour promotions.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Weather Correlation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary-500"></div>
                  <span className="text-sm">Rainy days show an average 18% decrease in foot traffic compared to similar dry days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary-500"></div>
                  <span className="text-sm">Optimal temperature range for maximum customer traffic is 65-75°F.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary-500"></div>
                  <span className="text-sm">Unusually warm days in cooler months drive above-average traffic for seasonal drinks.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium mb-3">Growth Trend</h3>
            <p className="text-sm text-gray-700 mb-4">
              The shop has seen a {Math.round((displayData[displayData.length - 1].actualCustomers / displayData[0].actualCustomers - 1) * 100)}% increase in customer traffic over the past {displayData.length} days, indicating positive growth momentum.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Recommendations Based on Historical Data</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent-500"></div>
                  <span>Increase staffing on Saturdays and Sundays by at least one person to accommodate higher traffic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent-500"></div>
                  <span>Consider running promotions on Mondays to boost traffic on the slowest day of the week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent-500"></div>
                  <span>Plan inventory with a 15-20% buffer for unexpected weather-related traffic changes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;