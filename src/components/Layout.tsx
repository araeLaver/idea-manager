import { Link, Outlet, useLocation } from 'react-router-dom';
import { PlusCircle, Lightbulb, Search, Calendar, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: '아이디어', icon: Home },
    { path: '/memos', label: '메모', icon: Calendar },
    { path: '/search', label: '검색', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-200">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">아이디어 매니저</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              
              <Link 
                to="/new" 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 ml-4 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 hover:scale-105"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">새 아이디어</span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800/90 border-t border-gray-700/50 backdrop-blur-sm">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              
              <Link 
                to="/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg mt-2 shadow-lg shadow-blue-600/25"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">새 아이디어</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}