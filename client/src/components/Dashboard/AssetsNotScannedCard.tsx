import React from "react";

const AssetsNotScannedCard: React.FC = () => {
  // Mock data - replace with real API later
  const mockData = {
    count: 22,
    devices: "devices",
  };

  const handleViewDetails = () => {
    console.log("Navigate to Assets Not Scanned details page");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      {/* Content centered */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Assets Not Scanned
        </h3>
        <div className="text-4xl font-bold text-orange-600 mb-2">
          {mockData.count}
        </div>
        <p className="text-sm text-gray-600">{mockData.devices}</p>
      </div>

      {/* Footer */}
      <button
        onClick={handleViewDetails}
        className="mt-4 text-gray-900 hover:text-gray-700 font-medium text-sm transition-colors duration-200"
      >
        View Details →
      </button>
    </div>
  );
};

export default AssetsNotScannedCard;
