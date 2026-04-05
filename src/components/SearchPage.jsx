import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { MEDICINE_DATA } from '../data/medicines.js';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [commonSearches, setCommonSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (MEDICINE_DATA) {
      // Get all available medicine keys
      const allKeys = Object.keys(MEDICINE_DATA);
      
      if (allKeys.length > 0) {
        // Shuffle and pick 2-3
        const shuffled = [...allKeys].sort(() => 0.5 - Math.random());
        const count = Math.min(allKeys.length, Math.floor(Math.random() * 2) + 2); // Returns 2 or 3
        setCommonSearches(shuffled.slice(0, count));
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/drug/${encodeURIComponent(query.toLowerCase())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 text-center">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-textPrimary mb-3">
          How can we help you today?
        </h2>
        <p className="text-textSecondary text-base mb-8 max-w-md mx-auto">
          Enter the name of a medication to find reliable information about its contents, side effects, and more.
        </p>

        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a drug (e.g. Paracetamol)..."
            className="w-full px-6 py-4 pl-14 rounded-2xl bg-white border-2 border-accent1/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-base shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary group-focus-within:text-primary transition-colors" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-textPrimary font-bold px-5 py-2 rounded-xl hover:bg-opacity-80 transition-all active:scale-95 text-sm"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex gap-2 flex-wrap justify-center">
          <span className="text-xs text-textSecondary font-bold">Common searches:</span>
          {commonSearches.map((key) => (
            <button
              key={key}
              onClick={() => {
                const drugName = MEDICINE_DATA[key].name;
                setQuery(drugName);
                navigate(`/drug/${encodeURIComponent(key)}`);
              }}
              className="text-[11px] px-3 py-1 bg-white border border-accent1/20 rounded-full hover:border-primary hover:text-primary transition-all font-semibold shadow-sm hover:shadow-md active:scale-95"
            >
              {MEDICINE_DATA[key].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
