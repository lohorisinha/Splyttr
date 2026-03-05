import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function ScanReceipt() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Theme colors
  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const cardBg = isDark ? '#05614B' : '#ffffff';
  const cardBorder = isDark ? '#084734' : '#e2f5e2';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textMuted = isDark ? '#6b9e8f' : '#9ca3af';
  const navBg = isDark ? '#05614B' : '#084734';

  const handleImageUpload = (file) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/expenses/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Scan failed');

      const formattedItems = data.items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price,
        selected: true,
      }));

      const total = formattedItems.reduce((sum, item) => sum + item.price, 0);

      navigate('/review-items', {
        state: { imagePreview, items: formattedItems, total: Math.round(total) },
      });
    } catch (error) {
      setScanning(false);
      toast.error(error.message || 'Could not read receipt. Try a clearer photo.');
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div style={{ backgroundColor: navBg }} className="shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center relative">
          <button
            onClick={() => navigate('/dashboard')}
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
            Scan Receipt
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Upload state */}
        {!imagePreview && !scanning && (
          <div
            className="rounded-3xl p-12 text-center transition-all duration-200 border-2 border-dashed"
            style={{
              backgroundColor: dragOver ? accentLight : cardBg,
              borderColor: dragOver ? accent : cardBorder,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {/* Animated icon */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: accentLight }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-black mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Upload Your Receipt
            </h2>
            <p
              className="text-sm mb-2 italic"
              style={{ fontFamily: "'Fraunces', serif", color: accent }}
            >
              We'll read it so you don't have to.
            </p>
            <p className="text-sm mb-8" style={{ color: textMuted }}>
              Drag & drop or click to choose • JPG, PNG, HEIC supported
            </p>

            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <span
                className="px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 inline-block shadow-lg"
                style={{ backgroundColor: accent, color: isDark ? '#020E0E' : '#ffffff' }}
              >
                Choose Photo
              </span>
            </label>
          </div>
        )}

        {/* Preview state */}
        {imagePreview && !scanning && (
          <div className="space-y-4">
            <div
              className="rounded-3xl border overflow-hidden"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: cardBorder }}
              >
                <h3
                  className="font-black"
                  style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
                >
                  Receipt Preview
                </h3>
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: accentLight, color: accent }}>
                  Ready to scan
                </span>
              </div>
              <div className="p-4">
                <img
                  src={imagePreview}
                  alt="Receipt"
                  className="w-full rounded-2xl object-contain max-h-96"
                  style={{ border: `1px solid ${cardBorder}` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="flex-1 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 border"
                style={{ backgroundColor: 'transparent', borderColor: cardBorder, color: textPrimary }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = accentLight}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Choose Different
              </button>
              <button
                onClick={handleScan}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg"
                style={{ backgroundColor: accent, color: isDark ? '#020E0E' : '#ffffff' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Scan Receipt
              </button>
            </div>
          </div>
        )}

        {/* Scanning state */}
        {scanning && (
          <div
            className="rounded-3xl border p-8 sm:p-12 text-center"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="relative mb-8 max-w-sm mx-auto">
              <img
                src={imagePreview}
                alt="Receipt"
                className="w-full rounded-2xl"
                style={{ opacity: 0.4, border: `1px solid ${cardBorder}` }}
              />
              {/* Scanning line */}
              <div
                className="absolute left-0 right-0 h-0.5 rounded-full"
                style={{
                  backgroundColor: accent,
                  animation: 'scanLine 2s ease-in-out infinite',
                  top: '50%',
                  boxShadow: `0 0 12px ${accent}`,
                }}
              />
              <style>{`
                @keyframes scanLine {
                  0% { top: 10%; opacity: 1; }
                  50% { top: 90%; opacity: 0.8; }
                  100% { top: 10%; opacity: 1; }
                }
              `}</style>
            </div>

            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: accent, borderTopColor: 'transparent' }}
            />
            <h3
              className="text-xl font-black mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Scanning Receipt...
            </h3>
            <p
              className="text-sm italic"
              style={{ fontFamily: "'Fraunces', serif", color: accent }}
            >
              Extracting items and prices for you.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ScanReceipt;