import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ReviewItems() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const { imagePreview, items: initialItems, total } = location.state || {};
  const [items, setItems] = useState(initialItems || []);

  if (!initialItems) {
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
  const textMuted = isDark ? '#6b9e8f' : '#9ca3af';
  const divider = isDark ? '#084734' : '#e8f5e8';
  const successBg = isDark ? 'rgba(1,222,130,0.1)' : 'rgba(8,71,52,0.06)';
  const successBorder = isDark ? 'rgba(1,222,130,0.3)' : 'rgba(8,71,52,0.2)';

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectedItems = items.filter(item => item.selected);
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleContinue = () => {
    navigate('/assign-people', {
      state: { imagePreview, items: selectedItems, total: selectedTotal }
    });
  };

  return (
    <div
      className="min-h-screen pb-32 transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div style={{ backgroundColor: navBg }} className="shadow-lg sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/scan-receipt')}
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
            Review Items
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Success banner */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4 border"
          style={{ backgroundColor: successBg, borderColor: successBorder }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentLight }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: textPrimary }}>
              Receipt scanned successfully!
            </p>
            <p className="text-xs" style={{ color: textMuted }}>
              Found {items.length} items • Total: ₹{total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Receipt thumbnail */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div
            className="px-5 py-3 border-b flex items-center justify-between"
            style={{ borderColor: divider }}
          >
            <p className="text-sm font-semibold" style={{ color: textPrimary }}>Receipt</p>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: accentLight, color: accent }}>
              {items.length} items found
            </span>
          </div>
          <div className="p-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Receipt"
              className="h-32 w-auto rounded-xl object-contain"
              style={{ border: `1px solid ${cardBorder}` }}
            />
          </div>
        </div>

        {/* Items list */}
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
              Extracted Items
            </h3>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>
              Uncheck items you don't want to split
            </p>
          </div>

          <div>
            {items.map((item, index) => (
              <label
                key={item.id}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-150"
                style={{
                  borderBottom: index < items.length - 1 ? `1px solid ${divider}` : 'none',
                  backgroundColor: item.selected ? 'transparent' : (isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'),
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = accentLight}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = item.selected ? 'transparent' : (isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)')}
              >
                {/* Custom checkbox */}
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150 border"
                  style={{
                    backgroundColor: item.selected ? accent : 'transparent',
                    borderColor: item.selected ? accent : (isDark ? '#6b9e8f' : '#cdedb3'),
                  }}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.selected && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#020E0E' : '#ffffff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                <p
                  className="flex-1 text-sm font-medium transition-all"
                  style={{
                    color: item.selected ? textPrimary : textMuted,
                    textDecoration: item.selected ? 'none' : 'line-through',
                  }}
                >
                  {item.name}
                </p>
                <p
                  className="font-black text-sm"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    color: item.selected ? accent : textMuted,
                  }}
                >
                  ₹{item.price.toFixed(2)}
                </p>
              </label>
            ))}
          </div>

          {/* Total footer */}
          <div
            className="px-5 py-4 border-t-2 flex justify-between items-center"
            style={{ borderColor: accent, backgroundColor: accentLight }}
          >
            <div>
              <p className="font-black text-sm" style={{ color: textPrimary, fontFamily: "'Syne', sans-serif" }}>
                Selected Total
              </p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                {selectedItems.length} of {items.length} items selected
              </p>
            </div>
            <p
              className="text-2xl font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: accent }}
            >
              ₹{selectedTotal.toFixed(2)}
            </p>
          </div>
        </div>

      </div>

      {/* Fixed bottom button */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 border-t"
        style={{ backgroundColor: bg, borderColor: cardBorder }}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={selectedItems.length === 0}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: selectedItems.length === 0 ? (isDark ? '#05614B' : '#cdedb3') : accent,
              color: selectedItems.length === 0 ? textMuted : (isDark ? '#020E0E' : '#ffffff'),
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {selectedItems.length === 0
              ? 'Select at least one item'
              : `Continue with ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewItems;