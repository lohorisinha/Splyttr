import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { register } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const cardBg = isDark ? '#020E0E' : '#ffffff';
  const rightPanelBg = isDark ? '#0a1a1a' : '#ffffff';
  const leftBg = isDark ? '#05614B' : '#084734';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentHover = isDark ? '#00c470' : '#063d28';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textSecondary = isDark ? '#a0c4b8' : '#4a5568';
  const inputBg = isDark ? '#020E0E' : '#f7fdf9';
  const inputBorder = isDark ? '#05614B' : '#cdedb3';
  const labelColor = isDark ? '#a0c4b8' : '#374151';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 shadow-lg"
        style={{ backgroundColor: isDark ? '#05614B' : '#084734' }}
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
        <div
          className="w-10 h-5 rounded-full relative transition-all duration-300"
          style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
            style={{ left: isDark ? '22px' : '2px' }}
          />
        </div>
      </button>

      {/* Card */}
      <div
        className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ backgroundColor: cardBg, minHeight: '600px' }}
      >
        {/* Left Panel */}
        <div
          className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
          style={{ backgroundColor: leftBg }}
        >
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-20 animate-pulse"
            style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }}
          />
          <div
            className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B', animationDelay: '1s' }}
          />

          <div>
            <h1
              className="text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Splyttr
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-8">
            {/* Animated bill split graphic */}
              <div className="relative w-56 h-56">
                {/* Center circle */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-xl z-10"
                  style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#084734" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>

                {/* Orbiting person avatars */}
                {[
                    { label: 'You', angle: 0, delay: '0s' },
                    { label: 'Alex', angle: 120, delay: '0.4s' },
                    { label: 'Sam', angle: 240, delay: '0.8s' },
                  ].map(({ label, angle, delay }) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 50 + 38 * Math.sin(rad);
                    const y = 50 - 38 * Math.cos(rad);
                    return (
                    <div
                      key={label}
                      className="absolute flex flex-col items-center gap-1"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        animation: `float 3s ease-in-out infinite`,
                        animationDelay: delay,
                      }}>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                      style={{
                        backgroundColor: isDark ? '#020E0E' : '#ffffff',
                        color: isDark ? '#01DE82' : '#084734',
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                    {label[0]}
                  </div>
                  <span className="text-xs font-medium text-white opacity-80">{label}</span>
                </div>
              );
            })}

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                  {[0, 120, 240].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    const x2 = 50 + 38 * Math.sin(rad);
                    const y2 = 50 - 38 * Math.cos(rad);
                    return (
                      <line
                        key={angle}
                        x1="50%" y1="50%"
                        x2={`${x2}%`} y2={`${y2}%`}
                        stroke={isDark ? '#01DE82' : '#CEF17B'}
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                    );
                  })}
                </svg>
              </div>

            <style>{`
              @keyframes float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                50% { transform: translate(-50%, -50%) translateY(-8px); }
              }
            `}</style>
          </div>

          <div>
            <h2
              className="text-3xl font-light text-white leading-tight mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Join thousands<br />
              <span style={{ color: isDark ? '#01DE82' : '#CEF17B' }}>splitting smarter.</span>
            </h2>
            <p className="text-sm opacity-60 text-white">
              Free forever. No hidden fees.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12" style={{ backgroundColor: rightPanelBg }}>
          <h1
            className="text-3xl font-black mb-8 md:hidden"
            style={{ fontFamily: "'Syne', sans-serif", color: accent }}
          >
            Splyttr
          </h1>

          <h2
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
          >
            Get started
          </h2>
          <p className="mb-8 text-sm" style={{ color: textSecondary }}>
            Create your free Splyttr account
          </p>

          <div className="space-y-4">
            {[
              { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'John Doe' },
              { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
              { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
                  {label}
                </label>
                <input
                  type={type}
                  required
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
                  style={{
                    backgroundColor: inputBg,
                    border: `1.5px solid ${inputBorder}`,
                    color: textPrimary,
                  }}
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>
            ))}

            <p className="text-xs" style={{ color: textSecondary }}>
              At least 6 characters
            </p>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: accent,
                color: isDark ? '#020E0E' : '#ffffff',
                opacity: loading ? 0.6 : 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => e.target.style.backgroundColor = accentHover}
              onMouseLeave={e => e.target.style.backgroundColor = accent}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <p className="mt-6 text-sm text-center" style={{ color: textSecondary }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold"
              style={{ color: accent }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;