
import { useState } from 'react';
import { Save, Upload, Key, Globe, Brush, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [maxTokens, setMaxTokens] = useState(2000);
  const [temperature, setTemperature] = useState(0.7);
  const [modelName, setModelName] = useState('gpt-35-turbo');
  const [theme, setTheme] = useState('light');
  const [exportFormat, setExportFormat] = useState('json');
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving settings
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved",
      });
    }, 500);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-2">Configure your MCQ generator application</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveSettings}>
            <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-mcq-light">
                  <Key className="h-6 w-6 text-mcq-primary" />
                </div>
                <h2 className="ml-4 text-lg font-semibold text-slate-800">API Configuration</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700">
                    Azure OpenAI API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Azure OpenAI API Key"
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Your API key will be stored securely
                  </p>
                </div>
                
                <div>
                  <label htmlFor="apiEndpoint" className="block text-sm font-medium text-slate-700">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://your-resource.openai.azure.com/"
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-slate-700">
                    Model Name
                  </label>
                  <select
                    id="model"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                  >
                    <option value="gpt-35-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-32k">GPT-4 32k</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-mcq-light">
                  <Globe className="h-6 w-6 text-mcq-primary" />
                </div>
                <h2 className="ml-4 text-lg font-semibold text-slate-800">Model Parameters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="maxTokens" className="block text-sm font-medium text-slate-700">
                      Max Tokens: {maxTokens}
                    </label>
                    <span className="text-xs text-slate-500">Range: 100-4000</span>
                  </div>
                  <input
                    type="range"
                    id="maxTokens"
                    min="100"
                    max="4000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="mt-1 block w-full accent-mcq-primary"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="temperature" className="block text-sm font-medium text-slate-700">
                      Temperature: {temperature}
                    </label>
                    <span className="text-xs text-slate-500">Range: 0-1</span>
                  </div>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="mt-1 block w-full accent-mcq-primary"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>More deterministic</span>
                    <span>More creative</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-mcq-light">
                  <Database className="h-6 w-6 text-mcq-primary" />
                </div>
                <h2 className="ml-4 text-lg font-semibold text-slate-800">Export Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Export Format
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={() => setExportFormat('json')}
                        className="form-radio h-4 w-4 text-mcq-primary"
                      />
                      <span className="ml-2 text-sm text-slate-700">JSON</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                        className="form-radio h-4 w-4 text-mcq-primary"
                      />
                      <span className="ml-2 text-sm text-slate-700">CSV</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="zip"
                        checked={exportFormat === 'zip'}
                        onChange={() => setExportFormat('zip')}
                        className="form-radio h-4 w-4 text-mcq-primary"
                      />
                      <span className="ml-2 text-sm text-slate-700">ZIP</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <button 
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Configuration
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 border mb-8 sticky top-8">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-mcq-light">
                <Brush className="h-6 w-6 text-mcq-primary" />
              </div>
              <h2 className="ml-4 text-lg font-semibold text-slate-800">Appearance</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer rounded-md p-2 border ${theme === 'light' ? 'border-mcq-primary ring-2 ring-mcq-primary/20' : 'border-slate-200'}`}
                  >
                    <div className="h-20 bg-white rounded border border-slate-200 flex flex-col">
                      <div className="h-4 bg-slate-100 m-1 rounded"></div>
                      <div className="flex-1 m-1 flex flex-col">
                        <div className="h-2 w-3/4 bg-slate-100 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="text-center mt-1 text-xs font-medium text-slate-700">Light</div>
                  </div>
                  
                  <div
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-md p-2 border ${theme === 'dark' ? 'border-mcq-primary ring-2 ring-mcq-primary/20' : 'border-slate-200'}`}
                  >
                    <div className="h-20 bg-slate-800 rounded border border-slate-700 flex flex-col">
                      <div className="h-4 bg-slate-700 m-1 rounded"></div>
                      <div className="flex-1 m-1 flex flex-col">
                        <div className="h-2 w-3/4 bg-slate-700 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-center mt-1 text-xs font-medium text-slate-700">Dark</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['#4F46E5', '#2563EB', '#7C3AED', '#DB2777', '#10B981'].map((color) => (
                    <div
                      key={color}
                      className="w-full aspect-square rounded-full cursor-pointer border-2 border-white ring-offset-2 hover:ring-2 hover:ring-slate-200"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Font Size
                </label>
                <select
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
