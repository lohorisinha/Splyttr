import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses/my');
        setExpenses(res.data.expenses || []);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalSplits = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Splyttr</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero CTA */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Split bills in seconds</h2>
          <p className="text-lg mb-6 text-indigo-100">Snap a receipt, we'll handle the math</p>
          <button
            onClick={() => navigate('/scan-receipt')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition shadow-lg inline-flex items-center gap-3"
          >
            <span className="text-2xl">📸</span>
            Scan Receipt
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Splits</p>
                <p className="text-2xl font-bold text-gray-900">{totalSplits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-indigo-600">₹{totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Splits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Splits</h3>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📸</span>
              <p className="text-gray-500 mb-4">No receipts scanned yet</p>
              <button
                onClick={() => navigate('/scan-receipt')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Scan Your First Receipt
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {expenses.map(expense => (
                <div key={expense._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {expense.items.length} items • {expense.people.length} people
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-indigo-600">
                    ₹{expense.totalAmount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Dashboard;