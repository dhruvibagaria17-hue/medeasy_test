import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  FolderPlus, 
  Folder, 
  Trash2, 
  Plus, 
  MoreVertical, 
  Pill,
  ChevronRight,
  ChevronDown,
  Lock,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthModal from './AuthModal.jsx';
import { getUserFolders, setUserFolders, logUserEvent } from '../services/userData.js';

const SavedMedicines = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});

  useEffect(() => {
    let cancelled = false;
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
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const saveFolders = async (updated) => {
    setFolders(updated);
    if (!user) return;
    try {
      await setUserFolders(user.uid, updated);
    } catch (_) {}
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
          <Lock className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-textPrimary mb-4 tracking-tight">Sign in to view your folders</h1>
        <p className="text-textSecondary text-xl max-w-md mb-12 font-medium leading-relaxed">
          Keep your medication history safe and organized across all your devices.
        </p>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-4 bg-primary text-textPrimary font-black px-12 py-5 rounded-[2rem] text-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <LogIn className="w-8 h-8" />
          Sign In Now
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  const createFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    const updated = [...folders, { 
      id: Date.now(), 
      name: newFolderName, 
      medicines: [] 
    }];
    saveFolders(updated);
    logUserEvent(user.uid, { type: 'create_folder', folderName: newFolderName }).catch(() => {});
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  const deleteFolder = (id) => {
    const updated = folders.filter(f => f.id !== id);
    saveFolders(updated);
    logUserEvent(user.uid, { type: 'delete_folder', folderId: id }).catch(() => {});
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const removeMedicine = (folderId, medName) => {
    const updated = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, medicines: f.medicines.filter(m => m !== medName) };
      }
      return f;
    });
    saveFolders(updated);
    logUserEvent(user.uid, { type: 'remove_medicine', folderId, medicineKey: medName }).catch(() => {});
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-textPrimary mb-2 flex items-center gap-3">
            <Bookmark className="w-10 h-10 text-primary" />
            Saved Medicines
          </h1>
          <p className="text-textSecondary text-lg">Organize your medications into custom folders for quick access.</p>
        </div>
        
        <button 
          onClick={() => setIsNewFolderModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-textPrimary font-bold px-6 py-3 rounded-xl hover:bg-opacity-80 transition-all shadow-sm"
        >
          <FolderPlus className="w-5 h-5" />
          New Folder
        </button>
      </div>

      <AnimatePresence>
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsNewFolderModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-2">
                <FolderPlus className="w-6 h-6 text-primary" />
                Create New Folder
              </h3>
              <form onSubmit={createFolder} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textPrimary block">Folder Name</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g., Heart Medications, Daily Vitamins..."
                    className="w-full px-4 py-4 rounded-xl bg-background border border-accent1/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewFolderModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-textSecondary font-bold hover:bg-background transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-textPrimary font-bold hover:bg-opacity-80 transition-all shadow-md"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {folders.length === 0 ? (
        <div className="bg-white p-16 rounded-[3rem] border border-accent1/20 text-center shadow-sm">
          <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-8">
            <Bookmark className="w-12 h-12 text-accent1" />
          </div>
          <h3 className="text-2xl font-bold text-textPrimary mb-4">Your medication library is empty</h3>
          <p className="text-textSecondary mb-10 max-w-md mx-auto">Create folders and save medications while you search to keep them organized here.</p>
          <button 
            onClick={() => setIsNewFolderModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-textPrimary font-bold px-10 py-4 rounded-xl hover:bg-opacity-80 transition-all shadow-lg shadow-primary/20"
          >
            Create Your First Folder
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-3xl border border-accent1/20 overflow-hidden transition-all shadow-sm hover:shadow-md">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer select-none"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${expandedFolders[folder.id] ? 'bg-primary text-textPrimary' : 'bg-background text-textSecondary'}`}>
                    <Folder className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-textPrimary group-hover:text-primary transition-colors">{folder.name}</h3>
                    <p className="text-sm text-textSecondary">{folder.medicines.length} medication{folder.medicines.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="p-2 text-textSecondary hover:text-accent2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="p-2 text-textSecondary">
                    {expandedFolders[folder.id] ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedFolders[folder.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-accent1/10 bg-background/30"
                  >
                    <div className="p-6 space-y-3">
                      {folder.medicines.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-textSecondary text-sm mb-4 italic">No medications saved in this folder yet.</p>
                          <Link to="/search" className="text-primary text-sm font-bold hover:underline flex items-center justify-center gap-1">
                            Go to search <Plus className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        folder.medicines.map((med) => (
                          <div key={med} className="bg-white p-4 rounded-2xl border border-accent1/10 flex items-center justify-between group">
                            <Link 
                              to={`/drug/${encodeURIComponent(med)}`}
                              className="flex items-center gap-4 flex-1"
                            >
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Pill className="w-5 h-5 text-primary" />
                              </div>
                              <span className="font-bold text-textPrimary text-lg group-hover:text-primary transition-colors capitalize">{med}</span>
                            </Link>
                            <button 
                              onClick={() => removeMedicine(folder.id, med)}
                              className="p-2 text-textSecondary hover:text-accent2 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMedicines;
