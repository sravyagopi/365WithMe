import React from 'react';

const WelcomeScreen = ({ onStartDay }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-indigo-900 mb-4">
          {new Date().getFullYear()}
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome to 365WithMe
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Every day is a new opportunity to grow, improve, and become the person you aspire to be.
        </p>
        <button
          onClick={onStartDay}
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          Start My Day
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;