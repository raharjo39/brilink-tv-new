
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, LayoutDashboard, MonitorPlay, Film, CalendarIcon, Settings, ServerIcon, BarChart, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Devices', icon: MonitorPlay, path: '/devices' },
    { name: 'Content', icon: Film, path: '/content' },
    { name: 'Campaigns', icon: CalendarIcon, path: '/campaigns' },
    { name: 'Analytics', icon: BarChart, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-bri-lightgray">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white border-r transition-all duration-300 flex flex-col h-full shadow-sm",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 border-b flex items-center px-4", 
          sidebarOpen ? "justify-between" : "justify-center"
        )}>
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-bri-blue text-white font-bold rounded-md h-8 w-8 flex items-center justify-center mr-2">
                B
              </div>
              <h1 className="font-heading font-bold text-xl text-bri-blue">BriLink TV</h1>
            </Link>
          )}
          
          {!sidebarOpen && (
            <div className="bg-bri-blue text-white font-bold rounded-md h-8 w-8 flex items-center justify-center">
              B
            </div>
          )}
          
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="text-gray-500"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm hover:bg-gray-100 transition-colors",
                    location.pathname === item.path ? "text-bri-blue font-medium bg-blue-50" : "text-gray-600",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !sidebarOpen && "mr-0")} />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User section */}
        <div className={cn(
          "border-t p-4 mt-auto",
          sidebarOpen ? "flex justify-between items-center" : "flex flex-col items-center"
        )}>
          {sidebarOpen ? (
            <>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="text-gray-500 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500 hover:text-red-500 mt-4"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 border-b flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-4"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            <h2 className="text-lg font-medium text-gray-800">
              {navigationItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-bri-blue text-white rounded-full flex items-center justify-center mr-2">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
