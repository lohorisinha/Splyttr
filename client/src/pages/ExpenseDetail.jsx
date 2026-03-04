import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Title
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241);
  doc.text('Splyttr', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Split Summary', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setDrawColor(99, 102, 241);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  // Date and total
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

  // Per person breakdown
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

  // Items list
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
      doc.setTextColor(99, 102, 241);
      doc.text(item.category, 14, y + 4);
      y += 4;
    }
    y += 7;
  });

  doc.save(`splyttr-split-${expense._id}.pdf`);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!expense) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Split Details</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-semibold"
            >
              📄 Export PDF
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Summary</h2>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{expense.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{expense.items.length} items • {expense.people.length} people</p>
            <p>{new Date(expense.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}</p>
          </div>
        </div>

        {/* Per Person Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Per Person Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {expense.splits.map((split, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{split.person}</p>
                  <p className="text-sm text-gray-500">
                    {split.items.length > 0 ? split.items.join(', ') : 'No items assigned'}
                  </p>
                </div>
                <p className="text-lg font-bold text-indigo-600">
                  ₹{split.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Items</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {expense.items.map((item, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.category && (
                    <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExpenseDetail;