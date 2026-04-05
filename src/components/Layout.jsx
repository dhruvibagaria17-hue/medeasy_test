import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import AuthModal from './AuthModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { User, LogIn } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative overflow-hidden">
        {/* Top Header */}
        <header className="absolute top-0 right-0 p-8 z-50 flex items-center justify-end w-full pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto bg-white/40 backdrop-blur-md p-2 px-4 rounded-2xl border border-white/50 shadow-sm">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-textPrimary font-bold text-sm">Hi {user.name}</span>
                  <button 
                    onClick={logout}
                    className="text-[10px] text-textSecondary hover:text-accent2 transition-colors font-bold uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-textPrimary font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </header>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Disclaimer Banner */}
        <div className="bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/50 py-2 px-8 text-center relative z-40">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-[0.15em]">
            Disclaimer: This website is for informative purposes only. Always consult a healthcare professional.
          </p>
        </div>

        {/* Artistic Background Image */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] mix-blend-multiply"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1532187863486-abf9d3971207?auto=format&fit=crop&q=80&w=2070')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.1) brightness(1.05)',
          }}
        />

        {/* Soft Decorative Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="relative z-10 p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
