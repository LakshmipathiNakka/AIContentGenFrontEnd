
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

  // Save settings to localStorage whenever they change
  useEffect(() => {
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  }, [settings]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value.toString());
      });
      
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
    
    setSettings(defaultSettings);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults",
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 gradient-text">Settings</h1>
        <p className="text-slate-500 mt-2">Customize your MCQ Generator experience</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border neon-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        
        <div className="mb-6">
          <label className="block text-slate-700 mb-2">Theme</label>
          <div className="theme-options">
            <div 
              className={`theme-option hover-scale ${settings.theme === 'light' ? 'selected' : ''}`} 
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
              className={`theme-option hover-scale ${settings.theme === 'dark' ? 'selected' : ''}`}
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
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={settings.animationsEnabled}
              onChange={() => setSettings({...settings, animationsEnabled: !settings.animationsEnabled})}
              className="mr-2 h-4 w-4"
            />
            <span>Enable animations and transitions</span>
          </label>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border neon-card mb-8">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-slate-700 mb-2">API Endpoint</label>
          <input 
            type="text" 
            value={settings.apiEndpoint}
            onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
            className="w-full px-4 py-2 border rounded-md interactive-input"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-slate-700 mb-2">API Key</label>
          <input 
            type="password" 
            value={settings.apiKey}
            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            className="w-full px-4 py-2 border rounded-md interactive-input"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border neon-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Default Settings</h2>
        
        <div className="mb-4">
          <label className="block text-slate-700 mb-2">Default Question Type</label>
          <select 
            value={settings.defaultQuestionType}
            onChange={(e) => setSettings({...settings, defaultQuestionType: e.target.value})}
            className="w-full px-4 py-2 border rounded-md interactive-input"
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
            <span>Save generation history</span>
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
            <span>Enable notifications</span>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-4">
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
          className="hover-scale"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
