import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Content Generator</span>
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