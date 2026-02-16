import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Splyttr</h1>
            </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero CTA - Scan Receipt */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Split bills in seconds</h2>
          <p className="text-lg mb-6 text-indigo-100">
            Snap a receipt, we'll handle the math
          </p>
          
          <button
            onClick={() => navigate('/scan-receipt')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition shadow-lg inline-flex items-center gap-3"
          >
            <span className="text-2xl">📸</span>
            Scan Receipt
          </button>
          
          <p className="mt-4 text-sm text-indigo-200">
            or <button onClick={() => navigate('/quick-split')} className="underline hover:text-white">quick split manually</button>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Splits</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">You Owe</p>
                <p className="text-2xl font-bold text-red-600">₹0</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📤</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">You're Owed</p>
                <p className="text-2xl font-bold text-green-600">₹0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Splits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Splits</h3>
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;