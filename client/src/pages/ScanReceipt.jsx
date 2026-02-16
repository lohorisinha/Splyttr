import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ScanReceipt() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    setScanning(true);
    
    // Mock scanning - wait 2 seconds then go to review
    setTimeout(() => {
      // Pass image data to next page
      navigate('/review-items', { 
        state: { 
          imagePreview,
          // Mock extracted items
          items: [
            { id: 1, name: 'Margherita Pizza', price: 450, selected: true },
            { id: 2, name: 'Pasta Alfredo', price: 320, selected: true },
            { id: 3, name: 'Garlic Bread', price: 180, selected: true },
            { id: 4, name: 'Coke (2x)', price: 120, selected: true },
            { id: 5, name: 'Ice Cream', price: 150, selected: true },
          ],
          total: 1220
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Scan Receipt</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {!imagePreview && !scanning && (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
            <span className="text-6xl mb-4 block">📸</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Receipt Photo
            </h2>
            <p className="text-gray-600 mb-6">
              Take a clear photo of your receipt
            </p>
            
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-block">
                Choose Photo
              </span>
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              Supports JPG, PNG, HEIC
            </p>
          </div>
        )}

        {imagePreview && !scanning && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Receipt Preview</h3>
              <img 
                src={imagePreview} 
                alt="Receipt" 
                className="w-full rounded-lg border border-gray-200"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Choose Different Photo
              </button>
              <button
                onClick={handleScan}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Scan Receipt →
              </button>
            </div>
          </div>
        )}

        {scanning && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="relative mb-6">
              <img 
                src={imagePreview} 
                alt="Receipt" 
                className="w-full max-w-md mx-auto rounded-lg opacity-50"
              />
              
              {/* Scanning animation overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="h-1 bg-indigo-600 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Scanning Receipt...
            </h3>
            <p className="text-gray-600">
              Extracting items and prices
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ScanReceipt;