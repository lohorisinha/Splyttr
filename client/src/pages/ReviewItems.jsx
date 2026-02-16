import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ReviewItems() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { imagePreview, items: initialItems, total } = location.state || {};
  const [items, setItems] = useState(initialItems || []);

  if (!initialItems) {
    navigate('/dashboard');
    return null;
  }

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectedItems = items.filter(item => item.selected);
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleContinue = () => {
    navigate('/assign-people', {
      state: {
        imagePreview,
        items: selectedItems,
        total: selectedTotal
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/scan-receipt')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Review Items</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Success message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">
                Receipt scanned successfully!
              </p>
              <p className="text-sm text-green-700">
                Found {items.length} items • Total: ₹{total}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt preview (small) */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <img 
            src={imagePreview} 
            alt="Receipt" 
            className="w-32 h-auto rounded border border-gray-200 mx-auto"
          />
        </div>

        {/* Items list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Extracted Items
            </h3>
            <p className="text-sm text-gray-600">
              Uncheck items you don't want to split
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map(item => (
              <label
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                </div>
                <p className="font-bold text-gray-900">₹{item.price}</p>
              </label>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Selected Total</span>
              <span className="text-2xl font-bold text-indigo-600">
                ₹{selectedTotal}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {selectedItems.length} of {items.length} items selected
            </p>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Split →
        </button>

      </div>
    </div>
  );
}

export default ReviewItems;