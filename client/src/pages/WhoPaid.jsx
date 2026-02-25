import { useLocation, useNavigate } from 'react-router-dom';

function WhoPaid() {
  const location = useLocation();
  const navigate = useNavigate();

  const { imagePreview, items, people, assignments, splits, total } = location.state || {};

  if (!splits) {
    navigate('/dashboard');
    return null;
  }

  const handleSelect = (payer) => {
    navigate('/split-result', {
      state: {
        imagePreview,
        items,
        people,
        assignments,
        splits,
        total,
        payer,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Who Paid?</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6 text-center">
          Select the person who paid the full bill
        </p>

        <div className="space-y-3">
          {people.map(person => (
            <button
              key={person}
              onClick={() => handleSelect(person)}
              className="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {person[0].toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900">{person}</span>
              </div>
              <span className="text-indigo-600 font-bold">₹{splits[person]?.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhoPaid;