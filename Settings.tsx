import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FormData } from '../types';

const Settings = () => {
  const { selectedShopId, coffeeShops, updatePredictionSettings } = useAppContext();
  const selectedShop = coffeeShops.find(shop => shop.id === selectedShopId);
  
  const [formData, setFormData] = useState<FormData>({
    shopName: selectedShop?.name || '',
    location: selectedShop?.location || '',
    weatherSensitivity: 0.8,
    seasonalFactor: 1.0,
    specialPromotions: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    setIsFormChanged(true);
    
    // Clear error when field is changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear success message when form is changed
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.weatherSensitivity < 0 || formData.weatherSensitivity > 1) {
      newErrors.weatherSensitivity = 'Weather sensitivity must be between 0 and 1';
    }
    
    if (formData.seasonalFactor < 0.5 || formData.seasonalFactor > 1.5) {
      newErrors.seasonalFactor = 'Seasonal factor must be between 0.5 and 1.5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updatePredictionSettings({
        shopId: selectedShopId,
        weatherSensitivity: formData.weatherSensitivity,
        seasonalFactor: formData.seasonalFactor,
        specialPromotions: formData.specialPromotions
      });
      
      setIsSaving(false);
      setIsFormChanged(false);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };
  
  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      shopName: selectedShop?.name || '',
      location: selectedShop?.location || '',
      weatherSensitivity: 0.8,
      seasonalFactor: 1.0,
      specialPromotions: false,
    });
    setIsFormChanged(false);
    setErrors({});
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-500">Configure your prediction settings</p>
      </div>
      
      {successMessage && (
        <div className="bg-success-500 bg-opacity-10 text-success-500 px-4 py-3 rounded-md flex items-center justify-between animate-fade-in">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-success-500 hover:text-success-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Prediction Configuration</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                className={`w-full rounded-md shadow-sm py-2 px-3 border ${errors.shopName ? 'border-error-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
              />
              {errors.shopName && (
                <p className="mt-1 text-sm text-error-500">{errors.shopName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full rounded-md shadow-sm py-2 px-3 border ${errors.location ? 'border-error-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-error-500">{errors.location}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="weatherSensitivity" className="block text-sm font-medium text-gray-700 mb-1">
                Weather Sensitivity Factor (0-1)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="weatherSensitivity"
                  name="weatherSensitivity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.weatherSensitivity}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 w-10">
                  {formData.weatherSensitivity.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                How much weather affects your customer traffic (0 = no effect, 1 = maximum effect)
              </p>
              {errors.weatherSensitivity && (
                <p className="mt-1 text-sm text-error-500">{errors.weatherSensitivity}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="seasonalFactor" className="block text-sm font-medium text-gray-700 mb-1">
                Seasonal Adjustment Factor (0.5-1.5)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="seasonalFactor"
                  name="seasonalFactor"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={formData.seasonalFactor}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 w-10">
                  {formData.seasonalFactor.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Adjust for seasonal variations (below 1 = reduce predictions, above 1 = increase predictions)
              </p>
              {errors.seasonalFactor && (
                <p className="mt-1 text-sm text-error-500">{errors.seasonalFactor}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="specialPromotions"
                  name="specialPromotions"
                  checked={formData.specialPromotions}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="specialPromotions" className="ml-2 text-sm font-medium text-gray-700">
                  Include Special Promotions in Prediction
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                When enabled, predictions will factor in the impact of promotional events
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!isFormChanged || isSaving}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 transition-colors ${
                !isFormChanged || isSaving
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!isFormChanged || isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors ${
                !isFormChanged || isSaving
                  ? 'bg-primary-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Advanced Settings</h2>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Data Integration</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-700">Connect with external data sources to enhance prediction accuracy.</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="weatherAPI"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="weatherAPI" className="ml-2 text-sm text-gray-700">
                      Weather API
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="localEvents"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="localEvents" className="ml-2 text-sm text-gray-700">
                      Local Events Calendar
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="holidayAPI"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="holidayAPI" className="ml-2 text-sm text-gray-700">
                      Holiday API
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="salesData"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="salesData" className="ml-2 text-sm text-gray-700">
                      POS Sales Data
                    </label>
                  </div>
                </div>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Manage Integrations
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Notification Preferences</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-700">Choose when and how you receive prediction alerts.</p>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <label htmlFor="dailyForecast" className="text-sm text-gray-700">
                      Daily Forecast Summary
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="dailyForecast" 
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
                      <div className="absolute w-5 h-5 bg-white rounded-full shadow-md transform -translate-y-1/2 top-1/2 left-0"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="weatherAlerts" className="text-sm text-gray-700">
                      Weather Impact Alerts
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="weatherAlerts" 
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
                      <div className="absolute w-5 h-5 bg-white rounded-full shadow-md transform -translate-y-1/2 top-1/2 left-0"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="staffingRecommendations" className="text-sm text-gray-700">
                      Staffing Recommendations
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="staffingRecommendations" 
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
                      <div className="absolute w-5 h-5 bg-white rounded-full shadow-md transform -translate-y-1/2 top-1/2 left-0"></div>
                    </div>
                  </div>
                </div>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Customize Notification Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;