import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function WhoPaid() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const { imagePreview, items, people, assignments, splits, total } = location.state || {};

  if (!splits) {
    navigate('/dashboard');
    return null;
  }

  // Theme colors
  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const navBg = isDark ? '#05614B' : '#084734';
  const cardBg = isDark ? '#05614B' : '#084734';
  const cardBorder = isDark ? '#084734' : '#063d28';
  const accent = isDark ? '#01DE82' : '#CEF17B';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(206,241,123,0.2)';
  const textPrimary = isDark ? '#ffffff' : '#ffffff';
  const textMuted = isDark ? '#6b9e8f' : 'rgba(255,255,255,0.75)';

  const handleSelect = (payer) => {
    navigate('/split-result', {
      state: { imagePreview, items, people, assignments, splits, total, payer }
    });
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div
        style={{ backgroundColor: navBg }}
        className="shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>

          <h1
            className="text-xl font-black text-white absolute left-1/2 transform -translate-x-1/2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Who Paid?
          </h1>

          <button
            onClick={toggleTheme}
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
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
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
          >
            Who footed the bill?
          </h2>
          <p className="text-sm italic" style={{ fontFamily: "'Fraunces', serif", color: textMuted }}>
            Everyone else will owe them money.
          </p>
        </div>

        <div className="space-y-3">
          {people.map(person => (
            <button
              key={person}
              onClick={() => handleSelect(person)}
              className="w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = isDark ? '#01DE82' : '#CEF17B';
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(1,222,130,0.15)' : '#0a5c38';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = cardBorder;
                e.currentTarget.style.backgroundColor = cardBg;
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(1,222,130,0.2)' : 'rgba(206,241,123,0.25)',
                    color: isDark ? '#01DE82' : '#CEF17B',
                    fontFamily: "'Syne', sans-serif"
                  }}
                >
                  {person[0].toUpperCase()}
                </div>
                <span
                  className="font-semibold text-sm"
                  style={{ color: textPrimary }}
                >
                  {person}
                </span>
              </div>
              <span
                className="font-black text-sm"
                style={{ fontFamily: "'Syne', sans-serif", color: accent }}
              >
                ₹{splits[person]?.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhoPaid;