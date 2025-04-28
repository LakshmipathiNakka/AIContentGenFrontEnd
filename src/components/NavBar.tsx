
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code, FileText, Database, Settings, Filter, Home } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Code size={28} className="text-mcq-primary" />
                <span className="ml-2 text-xl font-bold text-slate-800">MCQ Generator</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-mcq-primary text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <Home size={18} className="mr-1" />
                Dashboard
              </Link>
              <Link to="/generate" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <FileText size={18} className="mr-1" />
                Generate MCQs
              </Link>
              <Link to="/manage" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <Database size={18} className="mr-1" />
                Question Bank
              </Link>
              <Link to="/settings" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <Settings size={18} className="mr-1" />
                Settings
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="bg-white p-1 rounded-full text-slate-400 hover:text-slate-500"
            >
              <span className="sr-only">Filter</span>
              <Filter className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="bg-mcq-light text-mcq-primary block pl-3 pr-4 py-2 text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              className="text-slate-600 hover:bg-slate-50 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Generate MCQs
            </Link>
            <Link
              to="/manage"
              className="text-slate-600 hover:bg-slate-50 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Question Bank
            </Link>
            <Link
              to="/settings"
              className="text-slate-600 hover:bg-slate-50 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Settings
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800">Admin User</div>
                <div className="text-sm font-medium text-slate-500">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
