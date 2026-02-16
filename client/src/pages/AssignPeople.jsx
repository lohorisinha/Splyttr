import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AssignPeople() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { imagePreview, items, total } = location.state || {};
  const [people, setPeople] = useState(['You']);
  const [newPersonName, setNewPersonName] = useState('');
  const [assignments, setAssignments] = useState({});

  if (!items) {
    navigate('/dashboard');
    return null;
  }

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
    
    // Initialize splits for each person
    people.forEach(person => {
      splits[person] = 0;
    });

    // Calculate share for each item
    items.forEach(item => {
      const assignedPeople = assignments[item.id] || [];
      if (assignedPeople.length > 0) {
        const sharePerPerson = item.price / assignedPeople.length;
        assignedPeople.forEach(person => {
          splits[person] += sharePerPerson;
        });
      }
    });

    return splits;
  };

  const handleFinish = () => {
    const splits = calculateSplits();
    
    navigate('/split-result', {
      state: {
        imagePreview,
        items,
        people,
        assignments,
        splits,
        total
      }
    });
  };

  const allItemsAssigned = items.every(item => 
    assignments[item.id] && assignments[item.id].length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Assign Items</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Add people section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Who's splitting?</h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              placeholder="Add person name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <button
              onClick={addPerson}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {people.map((person, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium flex items-center gap-2"
              >
                {person}
                {person !== 'You' && (
                  <button
                    onClick={() => setPeople(people.filter((_, i) => i !== index))}
                    className="text-indigo-900 hover:text-indigo-600"
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
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {assignedPeople.length > 0 
                        ? `Split between ${assignedPeople.length} ${assignedPeople.length === 1 ? 'person' : 'people'}`
                        : 'Tap people to assign'
                      }
                    </p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {people.map(person => {
                    const isAssigned = assignedPeople.includes(person);
                    return (
                      <button
                        key={person}
                        onClick={() => toggleAssignment(item.id, person)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          isAssigned
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleFinish}
            disabled={!allItemsAssigned}
            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {allItemsAssigned ? 'Calculate Split →' : 'Assign all items to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignPeople;