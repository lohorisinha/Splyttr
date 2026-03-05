import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses/my');
        setExpenses(res.data.expenses || []);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this split?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
      toast.success('Split deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (expense.title || '').toLowerCase().includes(term) ||
      expense.people.some(p => p.toLowerCase().includes(term)) ||
      expense.items.some(i => i.name.toLowerCase().includes(term)) ||
      new Date(expense.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).toLowerCase().includes(term)
    );
  });

  const totalSplits = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0);

  // Theme colors
  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const navBg = isDark ? '#05614B' : '#084734';
  const cardBg = isDark ? '#05614B' : '#ffffff';
  const cardBorder = isDark ? '#084734' : '#e2f5e2';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textSecondary = isDark ? '#a0c4b8' : '#4a5568';
  const textMuted = isDark ? '#6b9e8f' : '#9ca3af';
  const divider = isDark ? '#084734' : '#e8f5e8';
  const inputBg = isDark ? '#020E0E' : '#f7fdf9';
  const inputBorder = isDark ? '#05614B' : '#cdedb3';
  const heroBg = isDark
    ? 'linear-gradient(135deg, #05614B 0%, #020E0E 100%)'
    : 'linear-gradient(135deg, #084734 0%, #0a6644 100%)';
  const deleteHover = isDark ? '#ff6b6b' : '#ef4444';

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navbar */}
      <nav style={{ backgroundColor: navBg }} className="sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1
              className="text-2xl font-black text-white tracking-tight cursor-pointer"
              style={{ fontFamily: "'Syne', sans-serif" }}
              onClick={() => navigate('/dashboard')}
            >
              Splyttr
            </h1>

            {/* Right side nav */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Welcome - hidden on mobile */}
              <span className="hidden sm:block text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Hey, <span className="font-semibold text-white">{user?.name?.split(' ')[0]}</span>
              </span>

              {/* Analytics button */}
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span className="hidden sm:inline">Analytics</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                {isDark ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Hero CTA */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 text-white relative overflow-hidden transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ background: heroBg }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }} />
          <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full opacity-5" style={{ backgroundColor: '#CEF17B' }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2
                className="text-2xl sm:text-4xl font-black text-white mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Split bills in seconds.
              </h2>
              <p
                className="text-sm sm:text-base font-light italic"
                style={{ fontFamily: "'Fraunces', serif", color: isDark ? '#01DE82' : '#CEF17B' }}
              >
                Snap a receipt, we'll handle the math.
              </p>
            </div>
            <button
              onClick={() => navigate('/scan-receipt')}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-lg whitespace-nowrap self-start sm:self-auto"
              style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B', color: '#084734' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
              Scan Receipt
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 gap-4 mb-6 sm:mb-8 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div
            className="p-5 sm:p-6 rounded-2xl border transition-all duration-200"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: textMuted }}>Total Splits</p>
                <p
                  className="text-2xl sm:text-3xl font-black"
                  style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
                >
                  {totalSplits}
                </p>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: accentLight }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
            </div>
          </div>

          <div
            className="p-5 sm:p-6 rounded-2xl border transition-all duration-200"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: textMuted }}>Total Spent</p>
                <p
                  className="text-2xl sm:text-3xl font-black"
                  style={{ fontFamily: "'Syne', sans-serif", color: accent }}
                >
                  ₹{totalSpent.toFixed(0)}
                </p>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: accentLight }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Splits */}
        <div
          className={`rounded-2xl border transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          {/* Header */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b"
            style={{ borderColor: divider }}
          >
            <h3
              className="text-lg sm:text-xl font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Recent Splits
            </h3>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search splits..."
                className="w-full sm:w-56 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: inputBg,
                  border: `1.5px solid ${inputBorder}`,
                  color: textPrimary,
                }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = inputBorder}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: accent, borderTopColor: 'transparent' }}
              />
              <p className="text-sm" style={{ color: textMuted }}>Loading splits...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4">🍕</div>
              <p
                className="text-xl font-black mb-2"
                style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
              >
                No splits yet!
              </p>
              <p className="text-sm mb-1" style={{ color: textMuted }}>Who paid for the last pizza? 🤔</p>
              <p className="text-xs" style={{ color: textMuted }}>
                Start scanning receipts and stop doing mental math at dinner tables.
              </p>
            </div>
          ) : (
            <div>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-sm" style={{ color: textMuted }}>
                    No splits found for <span className="font-semibold">"{search}"</span>
                  </p>
                </div>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer transition-all duration-150 group"
                    style={{
                      borderBottom: index < filteredExpenses.length - 1 ? `1px solid ${divider}` : 'none',
                    }}
                    onClick={() => navigate(`/expense/${expense._id}`)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = accentLight}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Left — icon + info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: accentLight }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm sm:text-base truncate transition-colors"
                          style={{ color: textPrimary, fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {expense.title || `${expense.items.length} items • ${expense.people.length} people`}
                        </p>
                        <p className="text-xs truncate" style={{ color: textMuted }}>
                          {expense.items.length} items • {expense.people.length} {expense.people.length === 1 ? 'person' : 'people'} • {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Right — amount + delete */}
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <p
                        className="text-base sm:text-lg font-black"
                        style={{ fontFamily: "'Syne', sans-serif", color: accent }}
                      >
                        ₹{expense.totalAmount.toFixed(0)}
                      </p>
                      <button
                        onClick={(e) => handleDelete(expense._id, e)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
                        style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                        title="Delete split"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;