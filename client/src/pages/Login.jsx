import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, user } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
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
        style={{ backgroundColor: cardBg, minHeight: '560px' }}
      >
        {/* Left Panel */}
        <div
          className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
          style={{ backgroundColor: leftBg }}
        >
          {/* Animated background circles */}
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-20 animate-pulse"
            style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }}
          />
          <div
            className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B', animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-5"
            style={{ backgroundColor: '#CEF17B' }}
          />

          {/* Logo */}
          <div>
            <h1
              className="text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Splyttr
            </h1>
          </div>

          {/* Animated graphic */}
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            {/* Floating receipt cards */}
            <div className="relative w-48 h-48">
              <div
                className="absolute top-0 left-4 w-36 h-44 rounded-2xl shadow-xl flex flex-col p-4 gap-2"
                style={{
                  backgroundColor: isDark ? '#020E0E' : '#ffffff',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <div className="w-full h-2 rounded-full opacity-40" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-3/4 h-2 rounded-full opacity-30" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-full h-2 rounded-full opacity-40" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-1/2 h-2 rounded-full opacity-30" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="mt-auto w-full h-6 rounded-lg" style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }} />
              </div>
              <div
                className="absolute top-8 left-16 w-36 h-44 rounded-2xl shadow-xl flex flex-col p-4 gap-2"
                style={{
                  backgroundColor: isDark ? '#05614B' : '#f0faf4',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '0.5s',
                }}
              >
                <div className="w-full h-2 rounded-full opacity-40" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-2/3 h-2 rounded-full opacity-30" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-full h-2 rounded-full opacity-40" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="w-3/4 h-2 rounded-full opacity-30" style={{ backgroundColor: isDark ? '#01DE82' : '#084734' }} />
                <div className="mt-auto w-full h-6 rounded-lg" style={{ backgroundColor: isDark ? '#01DE82' : '#CEF17B' }} />
              </div>
            </div>

            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-12px); }
              }
            `}</style>
          </div>

          {/* Tagline */}
          <div>
            <h2
              className="text-3xl font-light text-white leading-tight mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Split bills,<br />
              <span style={{ color: isDark ? '#01DE82' : '#CEF17B' }}>not friendships.</span>
            </h2>
            <p className="text-sm opacity-60 text-white">
              Scan receipts. Assign items. Done in seconds.
            </p>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12" style={{ backgroundColor: rightPanelBg }}>
          {/* Mobile logo */}
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
            Welcome back
          </h2>
          <p className="mb-8 text-sm" style={{ color: textSecondary }}>
            Log in to your Splyttr account
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                backgroundColor: accent,
                color: isDark ? '#020E0E' : '#ffffff',
                opacity: loading ? 0.6 : 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => e.target.style.backgroundColor = accentHover}
              onMouseLeave={e => e.target.style.backgroundColor = accent}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <p className="mt-6 text-sm text-center" style={{ color: textSecondary }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-colors"
              style={{ color: accent }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;