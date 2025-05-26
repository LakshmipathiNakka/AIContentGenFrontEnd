import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useTheme } from 'next-themes'; // ✅ Add this

const NavBar = () => {
  const { theme } = useTheme(); 

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  const logoSrc =
    theme === 'dark'
      ? 'https://framerusercontent.com/images/V5OZU3PKHm1TIkvU3NqCJsEtoV8.png'
      : 'https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/zh4t4uwwxv8pmc5amkbp';

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src={logoSrc} alt="Logo" className="w-15 h-12 m-4" />
            <span className="font-bold">Tech Content Generator</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground">
              Dashboard
            </Link>
            <Link to="/generate" className="transition-colors hover:text-foreground/80 text-foreground">
              Generate
            </Link>
            <Link to="/settings" className="transition-colors hover:text-foreground/80 text-foreground">
              Settings
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
