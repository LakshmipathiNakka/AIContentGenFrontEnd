
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    apiEndpoint: localStorage.getItem('apiEndpoint') || 'https://api.mcqgenerator.com',
    apiKey: localStorage.getItem('apiKey') || '',
    defaultQuestionType: localStorage.getItem('defaultQuestionType') || 'General MCQs',
    saveHistory: localStorage.getItem('saveHistory') === 'true',
    notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true',
    animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Apply theme when it changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save settings to localStorage whenever they change
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  }, [settings]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Save all settings to localStorage
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      });
    }, 800);
  };
  
  const handleReset = () => {
    const defaultSettings = {
      theme: 'light',
      apiEndpoint: 'https://api.mcqgenerator.com',
      apiKey: '',
      defaultQuestionType: 'General MCQs',
      saveHistory: true,
      notificationsEnabled: true,
      animationsEnabled: true,
    };
    
    // Apply default settings to localStorage
    Object.entries(defaultSettings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    
    setSettings(defaultSettings);
    
    // Update theme
    document.documentElement.classList.remove('dark');
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults",
    });
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({...settings, theme: newTheme});
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white gradient-text">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Customize your MCQ Generator experience</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card mb-8 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
          <span className="gradient-3d-bg h-8 w-8 rounded-full flex items-center justify-center mr-2 text-white">
            {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </span>
          Appearance
        </h2>
        
        <div className="mb-6">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Theme</label>
          <div className="theme-options">
            <div 
              className={`theme-option hover-scale ${settings.theme === 'light' ? 'selected ring-2 ring-blue-500' : ''}`} 
              onClick={() => setSettings({...settings, theme: 'light'})}
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
              className={`theme-option hover-scale ${settings.theme === 'dark' ? 'selected ring-2 ring-blue-500' : ''}`}
              onClick={() => setSettings({...settings, theme: 'dark'})}
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
          
          <button 
            className="mt-4 theme-toggle flex items-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            onClick={toggleTheme}
          >
            {settings.theme === 'dark' ? (
              <>
                <Sun size={18} className="mr-2 light-mode-icon" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <Moon size={18} className="mr-2 dark-mode-icon" />
                Switch to Dark Mode
              </>
            )}
          </button>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={settings.animationsEnabled}
              onChange={() => setSettings({...settings, animationsEnabled: !settings.animationsEnabled})}
              className="mr-2 h-4 w-4"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable animations and transitions</span>
          </label>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card mb-8 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">API Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">API Endpoint</label>
          <input 
            type="text" 
            value={settings.apiEndpoint}
            onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md interactive-input bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">API Key</label>
          <input 
            type="password" 
            value={settings.apiKey}
            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md interactive-input bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card mb-8 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Default Settings</h2>
        
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Default Question Type</label>
          <select 
            value={settings.defaultQuestionType}
            onChange={(e) => setSettings({...settings, defaultQuestionType: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md interactive-input bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          >
            <option value="General MCQs">General MCQs</option>
            <option value="Coding Analysis MCQs">Coding Analysis MCQs</option>
            <option value="Coding Questions">Coding Questions</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={settings.saveHistory}
              onChange={() => setSettings({...settings, saveHistory: !settings.saveHistory})}
              className="mr-2 h-4 w-4"
            />
            <span className="text-slate-700 dark:text-slate-300">Save generation history</span>
          </label>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={settings.notificationsEnabled}
              onChange={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
              className="mr-2 h-4 w-4"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable notifications</span>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="neon-button"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleReset}
          className="hover-scale bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
