import { Link, useLocation } from 'react-router-dom';
import { Info, Search, Database, Mail, Pill, History, Bookmark } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Info, label: 'About us', path: '/about' },
    { icon: Search, label: 'Search for a drug', path: '/search' },
    { icon: History, label: 'Recent searches', path: '/recent' },
    { icon: Bookmark, label: 'Saved medicines', path: '/saved' },
    { icon: Database, label: 'Data sources', path: '/sources' },
    { icon: Mail, label: 'Contact us', path: '/contact' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-accent1/30 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Pill className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-textPrimary">Medeasy</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-primary text-textPrimary font-semibold shadow-sm' 
                  : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 
                ${isActive ? 'text-textPrimary' : 'text-textSecondary group-hover:text-primary'}`} 
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-background rounded-xl">
        <p className="text-xs text-textSecondary font-medium">Your Health Partner</p>
        <p className="text-[10px] text-textSecondary/60 mt-1">Version 0.0.1</p>
      </div>
    </div>
  );
};

export default Sidebar;
