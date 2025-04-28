
import { useState, useEffect } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setApiKey(parsedSettings.apiKey || '');
      setApiEndpoint(parsedSettings.apiEndpoint || '');
      setMaxTokens(parsedSettings.maxTokens || 2000);
      setTemperature(parsedSettings.temperature || 0.7);
      setModelName(parsedSettings.modelName || 'gpt-35-turbo');
      setTheme(parsedSettings.theme || 'light');
      setExportFormat(parsedSettings.exportFormat || 'json');
    }
  }, []);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save settings to localStorage
    const settings = {
      apiKey,
      apiEndpoint,
      maxTokens,
      temperature,
      modelName,
      theme,
      exportFormat
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply theme changes
    document.documentElement.setAttribute('data-theme', theme);
    
    // Simulate a short delay to show the saving state
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved",
      });
    }, 500);
  };
  
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your question generator application</p>
      </div>
      
      <div className="settings-container">
        <div className="settings-main">
          <form onSubmit={handleSaveSettings}>
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon">
                  <Key className="icon-medium" />
                </div>
                <h2 className="card-title">API Configuration</h2>
              </div>
              
              <div className="card-content">
                <div className="form-field">
                  <label htmlFor="apiKey" className="field-label">
                    Azure OpenAI API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Azure OpenAI API Key"
                    className="text-input"
                  />
                  <p className="field-hint">
                    Your API key will be stored securely
                  </p>
                </div>
                
                <div className="form-field">
                  <label htmlFor="apiEndpoint" className="field-label">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://your-resource.openai.azure.com/"
                    className="text-input"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="model" className="field-label">
                    Model Name
                  </label>
                  <select
                    id="model"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="select-input"
                  >
                    <option value="gpt-35-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-32k">GPT-4 32k</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon">
                  <Globe className="icon-medium" />
                </div>
                <h2 className="card-title">Model Parameters</h2>
              </div>
              
              <div className="card-content">
                <div className="form-field">
                  <div className="field-header">
                    <label htmlFor="maxTokens" className="field-label">
                      Max Tokens: {maxTokens}
                    </label>
                    <span className="field-range">Range: 100-4000</span>
                  </div>
                  <input
                    type="range"
                    id="maxTokens"
                    min="100"
                    max="4000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="range-input"
                  />
                </div>
                
                <div className="form-field">
                  <div className="field-header">
                    <label htmlFor="temperature" className="field-label">
                      Temperature: {temperature}
                    </label>
                    <span className="field-range">Range: 0-1</span>
                  </div>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="range-input"
                  />
                  <div className="range-labels">
                    <span>More deterministic</span>
                    <span>More creative</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon">
                  <Database className="icon-medium" />
                </div>
                <h2 className="card-title">Export Settings</h2>
              </div>
              
              <div className="card-content">
                <div className="form-field">
                  <label className="field-label">
                    Export Format
                  </label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={() => setExportFormat('json')}
                        className="radio-input"
                      />
                      <span className="radio-label">JSON</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                        className="radio-input"
                      />
                      <span className="radio-label">CSV</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="zip"
                        checked={exportFormat === 'zip'}
                        onChange={() => setExportFormat('zip')}
                        className="radio-input"
                      />
                      <span className="radio-label">ZIP</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-field">
                  <button 
                    type="button"
                    className="outline-button"
                  >
                    <Upload className="button-icon" />
                    Import Configuration
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className={`primary-button ${isSaving ? 'loading' : ''}`}
                disabled={isSaving}
              >
                <Save className="button-icon" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="settings-sidebar">
          <div className="settings-card sticky">
            <div className="card-header">
              <div className="card-icon">
                <Brush className="icon-medium" />
              </div>
              <h2 className="card-title">Appearance</h2>
            </div>
            
            <div className="card-content">
              <div className="form-field">
                <label className="field-label">
                  Theme
                </label>
                <div className="theme-options">
                  <div
                    onClick={() => setTheme('light')}
                    className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
                  >
                    <div className="theme-preview light">
                      <div className="theme-header"></div>
                      <div className="theme-body">
                        <div className="theme-line"></div>
                        <div className="theme-line short"></div>
                      </div>
                    </div>
                    <div className="theme-label">Light</div>
                  </div>
                  
                  <div
                    onClick={() => setTheme('dark')}
                    className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
                  >
                    <div className="theme-preview dark">
                      <div className="theme-header"></div>
                      <div className="theme-body">
                        <div className="theme-line"></div>
                        <div className="theme-line short"></div>
                      </div>
                    </div>
                    <div className="theme-label">Dark</div>
                  </div>
                </div>
              </div>
              
              <div className="form-field">
                <label className="field-label">
                  Primary Color
                </label>
                <div className="color-options">
                  {['#4F46E5', '#2563EB', '#7C3AED', '#DB2777', '#10B981'].map((color) => (
                    <div
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-field">
                <label className="field-label">
                  Font Size
                </label>
                <select
                  className="select-input"
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
