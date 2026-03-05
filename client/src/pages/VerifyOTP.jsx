import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const cardBg = isDark ? '#05614B' : '#ffffff';
  const cardBorder = isDark ? '#084734' : '#e2f5e2';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textMuted = isDark ? '#6b9e8f' : '#6b7280';
  const inputBorder = isDark ? '#084734' : '#cdedb3';

  useEffect(() => {
    if (!email) navigate('/signup');
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every(c => /\d/.test(c))) {
      setOtp([...pasted, ...Array(6 - pasted.length).fill('')]);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return toast.error('Enter the full 6-digit code');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Email verified! Welcome to Splyttr 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 sm:p-10"
        style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: accentLight }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1
          className="text-2xl font-black text-center mb-2"
          style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
        >
          Check your email
        </h1>
        <p className="text-sm text-center mb-1" style={{ color: textMuted }}>
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold text-center mb-8" style={{ color: accent }}>
          {email}
        </p>

        {/* OTP inputs */}
        <div className="flex gap-2 sm:gap-3 justify-center mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-black rounded-xl outline-none transition-all duration-200"
              style={{
                backgroundColor: isDark ? '#020E0E' : '#f7fdf9',
                border: `2px solid ${digit ? accent : inputBorder}`,
                color: textPrimary,
                fontFamily: "'Syne', sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = digit ? accent : inputBorder}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200"
          style={{
            backgroundColor: accent,
            color: isDark ? '#020E0E' : '#ffffff',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className="text-xs text-center mt-6" style={{ color: textMuted }}>
          Didn't receive it? Check your spam folder or{' '}
          <button
            onClick={() => navigate('/signup')}
            className="font-semibold underline"
            style={{ color: accent }}
          >
            try again
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;