import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

function SplitResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');

  const { imagePreview, items, people, assignments, splits, total, payer } = location.state || {};

  if (!splits) {
    navigate('/dashboard');
    return null;
  }

  // Theme colors
  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const navBg = isDark ? '#05614B' : '#084734';
  const cardBg = isDark ? '#05614B' : '#ffffff';
  const cardBorder = isDark ? '#084734' : '#e2f5e2';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textMuted = isDark ? '#6b9e8f' : '#6b7280';
  const divider = isDark ? '#084734' : '#e8f5e8';
  const inputBg = isDark ? '#020E0E' : '#f7fdf9';
  const inputBorder = isDark ? '#084734' : '#cdedb3';

  const handleSave = async () => {
    setSaving(true);
    try {
      const splitsArray = people.map(person => ({
        person,
        amount: splits[person] || 0,
        items: items
          .filter(item => (assignments[item.id] || []).includes(person))
          .map(item => item.name),
      }));

      await api.post('/expenses/save', {
        title,
        items: items.map(({ name, price }) => ({ name, price })),
        people,
        splits: splitsArray,
        totalAmount: total,
      });

      toast.success('Split saved!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div
        style={{ backgroundColor: navBg }}
        className="shadow-lg sticky top-0 z-40 relative"
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
            Split Summary
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

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Success banner */}
        <div
          className="rounded-2xl p-6 text-center border"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="text-5xl mb-3 animate-bounce inline-block">🎉</div>
          <h2
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
          >
            Split Calculated!
          </h2>
          <p
            className="text-sm italic"
            style={{ fontFamily: "'Fraunces', serif", color: accent }}
          >
            ₹{total.toFixed(2)} • {people.length} people • {items.length} items
          </p>
        </div>

        {/* Per person breakdown */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: divider }}
          >
            <h3
              className="font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Per Person Breakdown
            </h3>
          </div>

          {people.map((person, index) => {
            const amount = splits[person] || 0;
            const isPayer = person === payer;

            return (
              <div
                key={person}
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: index < people.length - 1 ? `1px solid ${divider}` : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ backgroundColor: accentLight, color: accent, fontFamily: "'Syne', sans-serif" }}
                  >
                    {person[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2" style={{ color: textPrimary }}>
                      {person}
                      {isPayer && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: accentLight, color: accent }}
                        >
                          paid
                        </span>
                      )}
                    </p>
                    <p className="text-xs" style={{ color: textMuted }}>
                      {isPayer ? 'Paid the bill' : `Owes ${payer}`}
                    </p>
                  </div>
                </div>
                <p
                  className="text-xl font-black"
                  style={{ fontFamily: "'Syne', sans-serif", color: isPayer ? textPrimary : accent }}
                >
                  ₹{amount.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Item details */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: divider }}
          >
            <h3
              className="font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Item Details
            </h3>
          </div>

          {items.map((item, index) => {
            const assignedPeople = assignments[item.id] || [];
            const perPerson = assignedPeople.length > 0
              ? (item.price / assignedPeople.length).toFixed(2)
              : 0;

            return (
              <div
                key={item.id}
                className="px-5 py-4"
                style={{ borderBottom: index < items.length - 1 ? `1px solid ${divider}` : 'none' }}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm" style={{ color: textPrimary }}>{item.name}</p>
                  <p className="font-black text-sm" style={{ color: accent, fontFamily: "'Syne', sans-serif" }}>
                    ₹{item.price}
                  </p>
                </div>
                <p className="text-xs" style={{ color: textMuted }}>
                  {assignedPeople.join(', ')} • ₹{perPerson} each
                </p>
              </div>
            );
          })}
        </div>

        {/* Save actions */}
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this split (e.g. Dinner at Pizza Hut)..."
            className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
            style={{
              backgroundColor: inputBg,
              border: `1.5px solid ${inputBorder}`,
              color: textPrimary,
            }}
            onFocus={e => e.target.style.borderColor = accent}
            onBlur={e => e.target.style.borderColor = inputBorder}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              backgroundColor: accent,
              color: isDark ? '#020E0E' : '#ffffff',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Split'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-200 border"
            style={{ backgroundColor: 'transparent', borderColor: cardBorder, color: textPrimary }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = accentLight}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default SplitResult;