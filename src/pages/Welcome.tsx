import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to TWC Contacts Portal</h1>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">
              Manage your contacts efficiently with our easy-to-use portal.
            </p>
            
            <button
              onClick={() => navigate('/contacts/new')}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add New Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;