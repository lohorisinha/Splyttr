import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

function SplitResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const { imagePreview, items, people, assignments, splits, total, payer } = location.state || {};

  if (!splits) {
    navigate('/dashboard');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const splitsArray = people.map(person => ({
        person,
        amount: splits[person] || 0,
        items: items
          .filter(item => (assignments[item.id] || []).includes(person))
          .map(item => item.name),
      }));

      await api.post('/expenses/save', {
        items: items.map(({ name, price }) => ({ name, price })),
        people,
        splits: splitsArray,
        totalAmount: total,
      });

      toast.success('Split saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Split Summary</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 animate-bounce">
            <span className="text-6xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Split Calculated!
          </h2>
          <p className="text-gray-600">
            Total: ₹{total.toFixed(2)} • {people.length} people • {items.length} items
          </p>
        </div>

        {/* Breakdown by person */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Per Person Breakdown</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {people.map(person => {
              const amount = splits[person] || 0;
              const isYou = person === payer;

              return (
                <div key={person} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {person}
                        {isYou && <span className="ml-2 text-sm text-indigo-600">(paid)</span>}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isYou ? 'Paid the bill' : `Owes ${payer}`}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      isYou ? 'text-gray-900' : 'text-green-600'
                    }`}>
                      ₹{amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Item details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Item Details</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map(item => {
              const assignedPeople = assignments[item.id] || [];
              const perPerson = assignedPeople.length > 0 
                ? (item.price / assignedPeople.length).toFixed(2)
                : 0;

              return (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Split: {assignedPeople.join(', ')} (₹{perPerson} each)
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Split'}
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default SplitResult;