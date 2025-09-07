import { Link, Outlet, useLocation } from 'react-router-dom';
import { PlusCircle, Lightbulb, Search, Moon, Sun, Kanban, Grid3X3, BarChart3, History, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AIAssistant } from './AIAssistant';

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-primary transition-colors">
      <header className="bg-tertiary border-b border-primary backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Lightbulb className="h-8 w-8 text-accent transition-all group-hover:text-primary-400 group-hover:drop-shadow-glow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary bg-gradient-hero bg-clip-text text-transparent">
                  아이디어 매니저
                </span>
              </div>
            </Link>
            
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-1 mr-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-primary hover:text-white hover:bg-primary/90 border border-primary/20 hover:border-primary'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                대시보드
              </Link>
              <Link
                to="/ideas"
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/ideas'
                    ? 'bg-info text-white shadow-md'
                    : 'text-info hover:text-white hover:bg-info/90 border border-info/20 hover:border-info'
                }`}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                목록
              </Link>
              <Link
                to="/kanban"
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/kanban'
                    ? 'bg-success text-white shadow-md'
                    : 'text-success hover:text-white hover:bg-success/90 border border-success/20 hover:border-success'
                }`}
              >
                <Kanban className="h-4 w-4 mr-2" />
                칸반
              </Link>
              <Link
                to="/memos"
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/memos'
                    ? 'bg-warning text-white shadow-md'
                    : 'text-warning hover:text-white hover:bg-warning/90 border border-warning/20 hover:border-warning'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                일일메모
              </Link>
              <Link
                to="/history"
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/history'
                    ? 'bg-error text-white shadow-md'
                    : 'text-error hover:text-white hover:bg-error/90 border border-error/20 hover:border-error'
                }`}
              >
                <History className="h-4 w-4 mr-2" />
                히스토리
              </Link>
            </div>
            
            <nav className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2 rounded-xl hover:bg-hover transition-all group"
                title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 transition-transform group-hover:rotate-12" />
                ) : (
                  <Sun className="h-5 w-5 transition-transform group-hover:rotate-180 text-amber-400" />
                )}
              </button>
              
              <Link 
                to="/search" 
                className="btn-ghost p-2 rounded-xl hover:bg-hover transition-all group"
                title="검색"
              >
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
              
              <Link 
                to="/new" 
                className="btn btn-primary ml-2 shadow-glow hover:shadow-xl transition-all group"
                title="새 아이디어"
              >
                <PlusCircle className="h-5 w-5 mr-2 transition-transform group-hover:rotate-180" />
                <span className="font-semibold">새 아이디어</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
      
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}