import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/theme/theme-provider';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    googleSheetId: '',
    googleKeyfilePath: '',
    animationsEnabled: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = {
        googleSheetId: localStorage.getItem('googleSheetId') || '',
        googleKeyfilePath: localStorage.getItem('googleKeyfilePath') || '',
        animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
      };
      setSettings(savedSettings);
    };

    loadSettings();
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Save settings to localStorage
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
      googleSheetId: '',
      googleKeyfilePath: '',
      animationsEnabled: true,
    };
    
    // Clear settings from localStorage
    Object.keys(defaultSettings).forEach(key => {
      localStorage.removeItem(key);
    });
    
    setSettings(defaultSettings);
    setTheme('light');
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults",
    });
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
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </span>
          Appearance
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Toggle theme
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center space-x-2"
              >
                <Sun size={18} className="mr-2" />
                <span>Light Mode</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center space-x-2"
              >
                <Moon size={18} className="mr-2" />
                <span>Dark Mode</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>System Preference</Label>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card mb-8 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Google Sheets Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Google Sheet ID</label>
          <input 
            type="text" 
            value={settings.googleSheetId}
            onChange={(e) => setSettings({...settings, googleSheetId: e.target.value})}
            placeholder="Enter Google Sheet ID"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md interactive-input bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Google Keyfile Path</label>
          <input 
            type="text" 
            value={settings.googleKeyfilePath}
            onChange={(e) => setSettings({...settings, googleKeyfilePath: e.target.value})}
            placeholder="Enter path to Google Keyfile"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md interactive-input bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
