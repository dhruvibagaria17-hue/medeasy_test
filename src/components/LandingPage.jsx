import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, LogIn, User } from 'lucide-react';
import AuthModal from './AuthModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    navigate('/search');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans bg-slate-50 overflow-hidden">
      {/* Top Navigation */}
      <div className="fixed top-0 right-0 p-8 z-[100] flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-textPrimary font-bold">Hi {user.name}</span>
              <button 
                onClick={logout}
                className="text-xs text-textSecondary hover:text-accent2 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-accent1/20 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-textPrimary font-bold"
          >
            <LogIn className="w-5 h-5 text-primary" />
            Sign In / Sign Up
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Dynamic Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vibrantPrimary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vibrantSecondary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-vibrantBlue/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-vibrantPurple/20 rounded-full blur-[100px]" />
      </div>

      {/* Artsy Image with Blend Mode */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 z-0 mix-blend-multiply"
        style={{
          backgroundImage: `url('/src/data/New folder (2)/yellow-pink-cute-playful-small-pattern-fresh-background-poster_2754703.jpg!bw700')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.1) brightness(1.1)',
        }}
      />
      
      {/* Professional Overlay */}
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-10" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-20 text-center flex flex-col items-center group px-6"
        onClick={handleLogoClick}
      >
        <div className="relative mb-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 bg-gradient-to-tr from-vibrantPrimary via-vibrantSecondary to-vibrantBlue rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
          />
          <div className="relative w-44 h-44 bg-transparent rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-700">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center shadow-2xl">
              <Pill size={84} className="text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
        
        <h1 className="text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Medeasy
        </h1>
        <p className="text-textSecondary text-2xl font-medium opacity-80 mb-12 tracking-wide">
          Your Intelligent Healthcare Companion
        </p>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          whileTap={{ scale: 0.95 }}
          className="relative px-12 py-5 rounded-2xl font-bold text-xl text-white overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 transition-transform duration-500 group-hover/btn:scale-110" />
          <span className="relative flex items-center gap-3">
            <span>Get started!</span>
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
