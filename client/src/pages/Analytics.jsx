import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, RadialLinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, RadialLinearScale,
  Filler
);

function Analytics() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/expenses/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Theme colors
  const bg = isDark ? '#020E0E' : '#CDEDB3';
  const navBg = isDark ? '#05614B' : '#084734';
  const cardBg = isDark ? '#05614B' : '#ffffff';
  const cardBorder = isDark ? '#084734' : '#e2f5e2';
  const accent = isDark ? '#01DE82' : '#084734';
  const accentLight = isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#0a0a0a';
  const textMuted = isDark ? '#6b9e8f' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDark ? '#6b9e8f' : '#9ca3af';

  const CHART_COLORS = [
    '#01DE82', '#084734', '#CEF17B', '#05614B',
    '#00b368', '#CDEDB3', '#047857', '#34d399'
  ];

  const chartDefaults = {
    plugins: {
      legend: {
        labels: {
          color: tickColor,
          font: { family: 'DM Sans', size: 12 },
          boxWidth: 12,
          padding: 16,
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#05614B' : '#084734',
        titleColor: '#ffffff',
        bodyColor: 'rgba(255,255,255,0.8)',
        borderColor: isDark ? '#01DE82' : '#CEF17B',
        borderWidth: 1,
        padding: 10,
        titleFont: { family: 'Syne', size: 13, weight: 'bold' },
        bodyFont: { family: 'DM Sans', size: 12 },
        cornerRadius: 10,
      }
    }
  };

  const axisDefaults = {
    grid: { color: gridColor },
    ticks: { color: tickColor, font: { family: 'DM Sans', size: 11 } },
    border: { color: 'transparent' }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: accent, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!data || data.totalExpenses === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col gap-4"
        style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2"
          style={{ backgroundColor: accentLight }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <p className="font-black text-xl" style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}>
          No data yet
        </p>
        <p className="text-sm italic" style={{ fontFamily: "'Fraunces', serif", color: textMuted }}>
          Save some splits to see your analytics.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-2 px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: accent, color: isDark ? '#020E0E' : '#ffffff' }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // --- Chart data ---
  const categoryData = Object.entries(data.categoryTotals).map(([name, value]) => ({
    name, value: parseFloat(value.toFixed(2))
  }));

  const monthlyData = Object.entries(data.monthlyTotals).map(([month, value]) => ({
    month, amount: parseFloat(value.toFixed(2))
  }));

  const peopleData = Object.entries(data.peopleTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, splits: count }));

  const dayData = Object.entries(data.dayTotals).map(([day, amount]) => ({
    day, amount: parseFloat(amount.toFixed(2))
  }));

  // Cumulative spending for area chart
  let cumulative = 0;
  const cumulativeData = monthlyData.map(d => {
    cumulative += d.amount;
    return { month: d.month, total: parseFloat(cumulative.toFixed(2)) };
  });

  // Donut chart
  const donutData = {
    labels: categoryData.map(d => d.name),
    datasets: [{
      data: categoryData.map(d => d.value),
      backgroundColor: CHART_COLORS,
      borderColor: cardBg,
      borderWidth: 3,
      hoverOffset: 8,
    }]
  };

  // Line chart (monthly trend)
  const lineData = {
    labels: monthlyData.map(d => d.month),
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyData.map(d => d.amount),
      borderColor: isDark ? '#01DE82' : '#084734',
      backgroundColor: isDark ? 'rgba(1,222,130,0.08)' : 'rgba(8,71,52,0.06)',
      borderWidth: 2.5,
      pointBackgroundColor: isDark ? '#01DE82' : '#084734',
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
    }]
  };

  // Area chart (cumulative)
  const areaData = {
    labels: cumulativeData.map(d => d.month),
    datasets: [{
      label: 'Cumulative Spending',
      data: cumulativeData.map(d => d.total),
      borderColor: isDark ? '#CEF17B' : '#05614B',
      backgroundColor: isDark ? 'rgba(206,241,123,0.15)' : 'rgba(5,97,75,0.1)',
      borderWidth: 2.5,
      pointBackgroundColor: isDark ? '#CEF17B' : '#05614B',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    }]
  };

  // Bar chart (split partners)
  const barPeopleColors = ['#01DE82', '#CEF17B', '#00b368', '#84fab0', '#a7f3d0'];
  const barPeopleData = {
    labels: peopleData.map(d => d.name),
    datasets: [{
      label: 'Splits',
      data: peopleData.map(d => d.splits),
      backgroundColor: barPeopleColors.map(c => c + 'bb'),
      borderColor: barPeopleColors,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Bar chart (day of week)
  const barDayData = {
    labels: dayData.map(d => d.day),
    datasets: [{
      label: 'Amount Spent (₹)',
      data: dayData.map(d => d.amount),
      backgroundColor: isDark ? 'rgba(1,222,130,0.5)' : 'rgba(8,71,52,0.5)',
      borderColor: isDark ? '#01DE82' : '#084734',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Radar chart (spending pattern by category)
  const radarData = {
    labels: categoryData.map(d => d.name),
    datasets: [{
      label: 'Spending (₹)',
      data: categoryData.map(d => d.value),
      backgroundColor: isDark ? 'rgba(1,222,130,0.15)' : 'rgba(8,71,52,0.1)',
      borderColor: isDark ? '#01DE82' : '#084734',
      borderWidth: 2,
      pointBackgroundColor: isDark ? '#01DE82' : '#084734',
      pointRadius: 4,
    }]
  };

  const barOptions = {
    ...chartDefaults,
    scales: {
      x: axisDefaults,
      y: { ...axisDefaults, beginAtZero: true }
    },
    plugins: {
      ...chartDefaults.plugins,
      legend: { display: false }
    }
  };

  const lineOptions = {
    ...chartDefaults,
    scales: {
      x: axisDefaults,
      y: { ...axisDefaults, beginAtZero: true }
    }
  };

  const radarOptions = {
    ...chartDefaults,
    scales: {
      r: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { family: 'DM Sans', size: 10 }, backdropColor: 'transparent' },
        pointLabels: { color: tickColor, font: { family: 'DM Sans', size: 11 } },
        angleLines: { color: gridColor },
      }
    }
  };

  const ChartCard = ({ title, subtitle, children }) => (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
    >
      <div className="mb-5">
        <h3
          className="font-black text-base"
          style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5 italic" style={{ fontFamily: "'Fraunces', serif", color: textMuted }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div style={{ backgroundColor: navBg }} className="shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
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
            Analytics
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

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Splits', value: data.totalExpenses, isNum: true },
            { label: 'Total Spent', value: `₹${data.totalSpent.toFixed(0)}`, isNum: false },
            { label: 'Categories', value: categoryData.length, isNum: true },
            { label: 'Split Partners', value: peopleData.length, isNum: true },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border p-4 sm:p-5"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <p className="text-xs mb-1" style={{ color: textMuted }}>{label}</p>
              <p
                className="text-2xl font-black"
                style={{ fontFamily: "'Syne', sans-serif", color: accent }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Row 1: Donut + Radar side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ChartCard title="Spending by Category" subtitle="Where your money goes">
            <Doughnut
              data={donutData}
              options={{
                ...chartDefaults,
                cutout: '65%',
                plugins: {
                  ...chartDefaults.plugins,
                  legend: {
                    ...chartDefaults.plugins.legend,
                    position: 'bottom',
                  }
                }
              }}
            />
          </ChartCard>

          <ChartCard title="Spending Radar" subtitle="Category distribution at a glance">
            <Radar data={radarData} options={radarOptions} />
          </ChartCard>
        </div>

        {/* Row 2: Monthly trend line chart */}
        <ChartCard title="Monthly Spending Trend" subtitle="How much you've spent each month">
          <Line data={lineData} options={lineOptions} />
        </ChartCard>

        {/* Row 3: Cumulative area chart */}
        <ChartCard title="Cumulative Spending" subtitle="Your total spending over time">
          <Line data={areaData} options={lineOptions} />
        </ChartCard>

        {/* Row 4: Bar charts side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {peopleData.length > 0 && (
            <ChartCard title="Top Split Partners" subtitle="Who you split with most">
              <Bar data={barPeopleData} options={barOptions} />
            </ChartCard>
          )}
          <ChartCard title="Spending by Day" subtitle="Which days you spend the most">
            <Bar data={barDayData} options={barOptions} />
          </ChartCard>
        </div>

      </div>
    </div>
  );
}

export default Analytics;