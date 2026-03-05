import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function AssignPeople() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const { imagePreview, items, total } = location.state || {};
  const [people, setPeople] = useState(['You']);
  const [newPersonName, setNewPersonName] = useState('');
  const [assignments, setAssignments] = useState({});

  if (!items) {
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
  const inputBg = isDark ? '#020E0E' : '#f7fdf9';
  const inputBorder = isDark ? '#084734' : '#cdedb3';
  const divider = isDark ? '#084734' : '#e8f5e8';

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([...people, newPersonName.trim()]);
      setNewPersonName('');
    }
  };

  const toggleAssignment = (itemId, person) => {
    setAssignments(prev => {
      const itemAssignments = prev[itemId] || [];
      const isAssigned = itemAssignments.includes(person);
      return {
        ...prev,
        [itemId]: isAssigned
          ? itemAssignments.filter(p => p !== person)
          : [...itemAssignments, person]
      };
    });
  };

  const calculateSplits = () => {
    const splits = {};
    people.forEach(person => { splits[person] = 0; });
    items.forEach(item => {
      const assignedPeople = assignments[item.id] || [];
      if (assignedPeople.length > 0) {
        const sharePerPerson = item.price / assignedPeople.length;
        assignedPeople.forEach(person => { splits[person] += sharePerPerson; });
      }
    });
    return splits;
  };

  const handleFinish = () => {
    const splits = calculateSplits();
    navigate('/who-paid', {
      state: { imagePreview, items, people, assignments, splits, total }
    });
  };

  const allItemsAssigned = items.every(item =>
    assignments[item.id] && assignments[item.id].length > 0
  );

  return (
    <div
      className="min-h-screen pb-24 transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div
        style={{ backgroundColor: navBg }}
        className="shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          {/* Back button */}
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

          {/* Centered title */}
          <h1
            className="text-xl font-black text-white absolute left-1/2 transform -translate-x-1/2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Assign Items
          </h1>

          {/* Theme toggle */}
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

        {/* Add people section */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <h3
            className="font-black mb-4"
            style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
          >
            Who's splitting?
          </h3>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              placeholder="Add person name..."
              className="flex-1 px-4 py-2.5 rounded-xl outline-none transition-all duration-200 text-sm"
              style={{
                backgroundColor: inputBg,
                border: `1.5px solid ${inputBorder}`,
                color: textPrimary,
              }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = inputBorder}
            />
            <button
              onClick={addPerson}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ backgroundColor: accent, color: isDark ? '#020E0E' : '#ffffff' }}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {people.map((person, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                style={{ backgroundColor: accentLight, color: accent }}
              >
                {person}
                {person !== 'You' && (
                  <button
                    onClick={() => setPeople(people.filter((_, i) => i !== index))}
                    className="font-bold transition-opacity hover:opacity-60"
                    style={{ color: accent }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items assignment */}
        <div className="space-y-4">
          {items.map(item => {
            const assignedPeople = assignments[item.id] || [];
            const isFullyAssigned = assignedPeople.length > 0;

            return (
              <div
                key={item.id}
                className="rounded-2xl border p-5 transition-all duration-200"
                style={{
                  backgroundColor: cardBg,
                  borderColor: isFullyAssigned ? accent : cardBorder,
                  borderWidth: isFullyAssigned ? '1.5px' : '1px',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4
                      className="font-black text-sm"
                      style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: isFullyAssigned ? accent : textMuted }}>
                      {assignedPeople.length > 0
                        ? `Split between ${assignedPeople.length} ${assignedPeople.length === 1 ? 'person' : 'people'}`
                        : 'Tap people to assign'
                      }
                    </p>
                  </div>
                  <p
                    className="font-black text-base"
                    style={{ fontFamily: "'Syne', sans-serif", color: textPrimary }}
                  >
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {people.map(person => {
                    const isAssigned = assignedPeople.includes(person);
                    return (
                      <button
                        key={person}
                        onClick={() => toggleAssignment(item.id, person)}
                        className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200"
                        style={{
                          backgroundColor: isAssigned ? accent : inputBg,
                          color: isAssigned ? (isDark ? '#020E0E' : '#ffffff') : textPrimary,
                          border: `1.5px solid ${isAssigned ? accent : inputBorder}`,
                        }}
                      >
                        {person}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 border-t"
        style={{ backgroundColor: bg, borderColor: cardBorder }}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleFinish}
            disabled={!allItemsAssigned}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              backgroundColor: allItemsAssigned ? accent : (isDark ? '#05614B' : '#cdedb3'),
              color: allItemsAssigned ? (isDark ? '#020E0E' : '#ffffff') : textMuted,
              cursor: allItemsAssigned ? 'pointer' : 'not-allowed',
            }}
          >
            {allItemsAssigned ? 'Calculate Split' : 'Assign all items to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignPeople;