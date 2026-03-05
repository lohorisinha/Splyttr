import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/expenses/${id}`);
        setExpense(res.data.expense);
      } catch (error) {
        toast.error('Failed to load split details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

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

  const handleDelete = async () => {
    if (!window.confirm('Delete this split?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Split deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(8, 71, 52);
    doc.text('Splyttr', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Split Summary', pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setDrawColor(8, 71, 52);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      new Date(expense.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      }),
      14, y
    );
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(`Total: Rs.${expense.totalAmount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
    y += 12;

    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text('Per Person Breakdown', 14, y);
    y += 7;

    expense.splits.forEach(split => {
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(`${split.person}`, 14, y);
      doc.text(`Rs.${split.amount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
      y += 5;
      if (split.items.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`Items: ${split.items.join(', ')}`, 18, y);
        y += 6;
      }
      y += 2;
    });

    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text('Items', 14, y);
    y += 7;

    expense.items.forEach(item => {
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(item.name, 14, y);
      doc.text(`Rs.${item.price.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
      if (item.category) {
        doc.setFontSize(9);
        doc.setTextColor(8, 71, 52);
        doc.text(item.category, 14, y + 4);
        y += 4;
      }
      y += 7;
    });

    doc.save(`splyttr-split-${expense._id}.pdf`);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bg }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: accent, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!expense) return null;

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
          {/* Back */}
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

          {/* Centered title */}
          <h1
            className="text-xl font-black text-white absolute left-1/2 transform -translate-x-1/2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Split Details
          </h1>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              title="Export PDF"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{ backgroundColor: 'rgba(239,68,68,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.35)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)'}
              title="Delete split"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
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
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Summary card */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex justify-between items-start mb-3">
            <h2
              className="text-lg font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              {expense.title || 'Split Summary'}
            </h2>
            <span
              className="text-2xl font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: accent }}
            >
              ₹{expense.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="text-xs space-y-0.5" style={{ color: textMuted }}>
            <p>{expense.items.length} items • {expense.people.length} people</p>
            <p>{new Date(expense.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}</p>
          </div>
        </div>

        {/* Per Person Breakdown */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: divider }}>
            <h3
              className="font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Per Person Breakdown
            </h3>
          </div>
          {expense.splits.map((split, index) => (
            <div
              key={index}
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: index < expense.splits.length - 1 ? `1px solid ${divider}` : 'none' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: accentLight, color: accent, fontFamily: "'Syne', sans-serif" }}
                >
                  {split.person[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: textPrimary }}>
                    {split.person}
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    {split.items.length > 0 ? split.items.join(', ') : 'No items assigned'}
                  </p>
                </div>
              </div>
              <p
                className="font-black text-base"
                style={{ fontFamily: "'Syne', sans-serif", color: accent }}
              >
                ₹{split.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Items List */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: divider }}>
            <h3
              className="font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
            >
              Items
            </h3>
          </div>
          {expense.items.map((item, index) => (
            <div
              key={index}
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: index < expense.items.length - 1 ? `1px solid ${divider}` : 'none' }}
            >
              <div>
                <p className="font-medium text-sm" style={{ color: textPrimary }}>{item.name}</p>
                {item.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ backgroundColor: accentLight, color: accent }}
                  >
                    {item.category}
                  </span>
                )}
              </div>
              <p
                className="font-black text-sm"
                style={{ fontFamily: "'Syne', sans-serif", color: accent }}
              >
                ₹{item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ExpenseDetail;