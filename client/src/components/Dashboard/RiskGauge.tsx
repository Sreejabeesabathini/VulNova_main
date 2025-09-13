import React from 'react';

interface RiskGaugeProps {
  riskScore: number;
  riskStatus: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ 
  riskScore, 
  riskStatus, 
  size = 'lg',
  showValue = true 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-32 h-32', gauge: 'w-32 h-32', text: 'text-lg' };
      case 'md':
        return { container: 'w-40 h-40', gauge: 'w-40 h-40', text: 'text-xl' };
      case 'lg':
        return { container: 'w-48 h-48', gauge: 'w-48 h-48', text: 'text-2xl' };
      default:
        return { container: 'w-48 h-48', gauge: 'w-48 h-48', text: 'text-2xl' };
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 700) return '#ef4444'; // Red
    if (score >= 400) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  const getRiskLevel = (score: number) => {
    if (score >= 700) return 'High Risk';
    if (score >= 400) return 'Medium Risk';
    return 'Low Risk';
  };

  const sizeClasses = getSizeClasses();
  const riskColor = getRiskColor(riskScore);
  const riskLevel = getRiskLevel(riskScore);
  
  // Calculate progress (0-100%)
  const progress = Math.min((riskScore / 1000) * 100, 100);
  const circumference = 2 * Math.PI * 50; // radius = 50
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Clean Circular Progress Ring */}
      <div className={`relative ${sizeClasses.container} flex items-center justify-center`}>
        <svg className={`${sizeClasses.gauge} transform -rotate-90`} viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="50"
            stroke="#f3f4f6"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r="50"
            stroke={riskColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${sizeClasses.text} text-gray-900`}>
              {riskScore}
            </div>
            <div className="text-xs text-gray-500 font-medium">Risk Score</div>
          </div>
        </div>
      </div>
      
      {/* Risk Level Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        riskLevel === 'High Risk' 
          ? 'bg-red-100 text-red-800 border border-red-200' 
          : riskLevel === 'Medium Risk'
          ? 'bg-orange-100 text-orange-800 border border-orange-200'
          : 'bg-green-100 text-green-800 border border-green-200'
      }`}>
        {riskLevel}
      </div>
      
      {/* Status message */}
      <div className="text-center text-sm text-gray-600 max-w-xs">
        {riskScore > 700 
          ? 'Your risk score is above the industry average' 
          : 'Your risk score is within acceptable range'
        }
      </div>
    </div>
  );
};

export default RiskGauge;

