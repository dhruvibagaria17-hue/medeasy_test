import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  AlertCircle, 
  ArrowRightLeft, 
  Activity, 
  Utensils, 
  ArrowLeft,
  BookmarkPlus,
  Bell,
  Check,
  FolderOpen,
  XCircle,
  SearchX,
  Plus,
  LogIn,
  Lock,
  AlertTriangle,
  Baby,
  Clock,
  ChevronDown,
  Info
} from 'lucide-react';
import SMSReminderPopup from './SMSReminderPopup.jsx';
import AuthModal from './AuthModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { MEDICINE_DATA } from '../data/medicines.js';
import { getUserFolders, setUserFolders, logUserEvent } from '../services/userData.js';

const DrugDetails = () => {
  const { user } = useAuth();
  const { name } = useParams();
  const navigate = useNavigate();
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotFoundOpen, setIsNotFoundOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [folders, setFolders] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const formatDescription = (text, sectionId) => {
    if (!text) return null;

    // Special rendering for Side Effects and Contraindications
    if (sectionId === 'side-effects' || sectionId === 'contraindications') {
      const categories = [
        { key: 'Serious', color: 'bg-red-50 border-red-100 text-red-800', icon: AlertCircle },
        { key: 'Urgent', color: 'bg-red-50 border-red-100 text-red-800', icon: AlertCircle },
        { key: 'Very Common', color: 'bg-indigo-50 border-indigo-100 text-indigo-800', icon: Activity },
        { key: 'Common', color: 'bg-blue-50 border-blue-100 text-blue-800', icon: Check },
        { key: 'Uncommon', color: 'bg-amber-50 border-amber-100 text-amber-800', icon: Clock },
        { key: 'Rare', color: 'bg-slate-50 border-slate-100 text-slate-800', icon: Info },
        { key: 'Very Rare', color: 'bg-slate-50 border-slate-100 text-slate-800', icon: Info },
        { key: 'Not Known', color: 'bg-gray-50 border-gray-100 text-gray-800', icon: Info },
        { key: 'Allergic', color: 'bg-purple-50 border-purple-100 text-purple-800', icon: AlertTriangle }
      ];

      // Try to split by common category markers found in the data
      const parts = text.split(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*:)/g).filter(p => p.trim());
      
      if (parts.length > 1) {
        const rendered = [];
        for (let i = 0; i < parts.length; i += 2) {
          const header = parts[i];
          const content = parts[i + 1] || '';
          
          const category = categories.find(c => header.includes(c.key)) || { color: 'bg-white border-accent1/10 text-textPrimary', icon: Info };
          
          rendered.push(
            <div key={i} className={`mb-4 p-5 rounded-2xl border ${category.color} shadow-sm last:mb-0`}>
              <div className="flex items-center gap-2 mb-3">
                <category.icon className="w-4 h-4 shrink-0" />
                <span className="font-black text-xs uppercase tracking-wider">{header.replace(':', '')}</span>
              </div>
              <div className="space-y-2">
                {content.split('. ').filter(s => s.trim()).map((sentence, sIdx) => (
                  <div key={sIdx} className="flex gap-2 items-start">
                    <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0 opacity-40" />
                    <p className="text-[13px] font-medium leading-relaxed opacity-90">
                      {sentence.trim()}{sentence.endsWith('.') ? '' : '.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return <div className="space-y-3">{rendered}</div>;
      }
    }

    // Default bullet point rendering
    return text.split('. ').filter(s => s.trim()).map((sentence, index) => (
      <div key={index} className="flex gap-2 mb-1.5 items-start">
        <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0 opacity-40" />
        <p className="text-[13px] font-medium leading-relaxed opacity-80">
          {sentence.trim()}{sentence.endsWith('.') ? '' : '.'}
        </p>
      </div>
    ));
  };

  const decodedName = decodeURIComponent(name).toLowerCase();
  const drugInfo = MEDICINE_DATA[decodedName];

  useEffect(() => {
    let cancelled = false;
    if (!drugInfo) {
      setIsNotFoundOpen(true);
      return;
    }

    // Track recent search
    const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    if (!recent.includes(decodedName)) {
      const updated = [decodedName, ...recent].slice(0, 10);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }

    // Load folders for saving
    const run = async () => {
      if (!user) {
        setFolders([]);
        return;
      }
      try {
        const saved = await getUserFolders(user.uid);
        if (!cancelled) setFolders(saved);
      } catch (_) {
        if (!cancelled) setFolders([]);
      }
      logUserEvent(user.uid, { type: 'view_drug', medicineKey: decodedName }).catch(() => {});
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [name, drugInfo, decodedName, user]);

  const closeNotFound = () => {
    setIsNotFoundOpen(false);
    navigate('/search');
  };

  const handleSaveClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsSaveModalOpen(true);
    }
  };

  const saveToFolder = (folderId) => {
    const decodedName = decodeURIComponent(name).toLowerCase();
    const updated = folders.map(f => {
      if (f.id === folderId) {
        if (!f.medicines.includes(decodedName)) {
          return { ...f, medicines: [...f.medicines, decodedName] };
        }
      }
      return f;
    });
    
    setFolders(updated);
    if (user) {
      setUserFolders(user.uid, updated).catch(() => {});
      logUserEvent(user.uid, { type: 'save_medicine', folderId, medicineKey: decodedName }).catch(() => {});
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaveModalOpen(false);
    }, 1500);
  };

  const sections = drugInfo ? [
    {
      id: 'how-to-take',
      title: "How to take it?",
      description: drugInfo.how_to_take,
      icon: Activity,
      color: "bg-accent1/10 text-accent1"
    },
    {
      id: 'side-effects',
      title: "Possible side effects",
      description: drugInfo.side_effects,
      icon: AlertCircle,
      color: "bg-accent2/10 text-accent2"
    },
    {
      id: 'contraindications',
      title: "Contraindications",
      description: drugInfo.contraindications,
      icon: XCircle,
      color: "bg-red-500/10 text-red-500"
    },
    {
      id: 'interactions-med',
      title: "Interaction with other drugs",
      description: drugInfo.interactions_med,
      icon: ArrowRightLeft,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      id: 'interactions-food',
      title: "Interaction with food",
      description: drugInfo.interactions_food,
      icon: Utensils,
      color: "bg-secondary/10 text-secondary"
    },
    ...(drugInfo.warnings ? [{
      id: 'warnings',
      title: "Important Warnings",
      description: drugInfo.warnings,
      icon: AlertTriangle,
      color: "bg-amber-500/10 text-amber-500"
    }] : []),
    ...(drugInfo.pregnancy ? [{
      id: 'pregnancy',
      title: "Pregnancy & Breastfeeding",
      description: drugInfo.pregnancy,
      icon: Baby,
      color: "bg-pink-500/10 text-pink-500"
    }] : []),
    ...(drugInfo.missed_dose ? [{
      id: 'missed-dose',
      title: "If you miss a dose",
      description: drugInfo.missed_dose,
      icon: Clock,
      color: "bg-indigo-500/10 text-indigo-500"
    }] : [])
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!drugInfo && isNotFoundOpen) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-4 border-white"
          >
            <div className="w-24 h-24 bg-accent2/10 rounded-full flex items-center justify-center mx-auto mb-8 text-accent2">
              <SearchX className="w-12 h-12" />
            </div>
            
            <h3 className="text-2xl font-black text-textPrimary mb-4">Information Unavailable</h3>
            <p className="text-textSecondary text-lg font-medium leading-relaxed mb-10">
              The information is not available at the moment. Please try again later.
            </p>
            
            <button
              onClick={closeNotFound}
              className="w-full py-4 rounded-2xl bg-textPrimary text-white font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
            >
              Back to Search
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  if (!drugInfo && !isNotFoundOpen) {
    return <div className="p-8 text-center text-textSecondary">Loading drug information...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-8">
      {/* Header with Search & Actions */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col gap-4 max-w-2xl">
          <Link 
            to="/search" 
            className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors font-bold group w-fit"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black text-textPrimary capitalize tracking-tight">
              {drugInfo.name}
            </h1>
            <p className="text-textSecondary text-xl font-medium leading-relaxed max-w-xl">
              {drugInfo.used_for}
            </p>
          </div>
        </div>

        {drugInfo && (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSaveClick}
              className="flex items-center gap-2 bg-white border border-accent1/20 px-4 py-2 rounded-xl text-textSecondary hover:text-primary hover:border-primary/30 transition-all font-semibold shadow-sm"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save Medicine
            </button>
            <button 
              onClick={() => setIsReminderOpen(true)}
              className="flex items-center gap-2 bg-accent2 text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition-all font-bold shadow-md shadow-accent2/20"
            >
              <Bell className="w-4 h-4" />
              Set Reminder
            </button>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Save to Folder Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsSaveModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-primary" />
                Save to Folder
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {folders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-textSecondary mb-4">You don't have any folders yet.</p>
                    <Link to="/saved" className="text-primary font-bold hover:underline">Create a folder first</Link>
                  </div>
                ) : (
                  folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => saveToFolder(folder.id)}
                      className="w-full p-4 rounded-2xl border border-accent1/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-between group"
                    >
                      <span className="font-bold text-textPrimary group-hover:text-primary transition-colors">{folder.name}</span>
                      {saveSuccess ? <Check className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-textSecondary" />}
                    </button>
                  ))
                )}
              </div>
              
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="w-full py-3 rounded-xl text-textSecondary font-bold hover:bg-background transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SMS Reminder Popup */}
      {drugInfo && (
        <SMSReminderPopup 
          isOpen={isReminderOpen} 
          onClose={() => setIsReminderOpen(false)} 
          drugName={decodeURIComponent(name)}
        />
      )}

      {/* Main Sections Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4"
      >
        {sections.map((section) => (
          <motion.div
            key={section.id}
            variants={itemVariants}
            className="group"
          >
            <div 
              onClick={() => toggleSection(section.id)}
              className={`w-full text-left p-6 rounded-3xl border border-transparent transition-all duration-300 cursor-pointer ${
                expandedSection === section.id 
                ? 'bg-white shadow-xl border-accent1/20 scale-[1.01]' 
                : 'bg-white/50 hover:bg-white hover:shadow-lg border-white/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${section.color}`}>
                    <section.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-textPrimary tracking-tight">
                    {section.title}
                  </h3>
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${expandedSection === section.id ? 'bg-primary/10 text-primary rotate-180' : 'bg-background text-textSecondary'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 pb-2 px-1 border-t border-accent1/10 mt-6 text-textSecondary">
                      {formatDescription(section.description, section.id)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Notice Area */}
      {drugInfo && (
        <div className="mt-12 p-8 rounded-2xl bg-accent1/5 border border-dashed border-accent1/40 text-center">
          <p className="text-textSecondary italic text-sm">
            Disclaimer: Information for this drug is being updated. Please consult your healthcare provider for medical advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugDetails;
