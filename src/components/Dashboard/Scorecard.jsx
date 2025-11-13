import React from 'react';

const Scorecard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex items-center">
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Scorecard;
