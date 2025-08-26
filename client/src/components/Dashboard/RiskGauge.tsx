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
        return { container: 'w-32 h-32', gauge: 'w-28 h-28', text: 'text-lg' };
      case 'md':
        return { container: 'w-40 h-40', gauge: 'w-36 h-36', text: 'text-xl' };
      case 'lg':
        return { container: 'w-48 h-48', gauge: 'w-44 h-44', text: 'text-2xl' };
      default:
        return { container: 'w-48 h-48', gauge: 'w-44 h-44', text: 'text-2xl' };
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 800) return { stroke: '#ef4444', bg: '#fef2f2' }; // Red
    if (score >= 600) return { stroke: '#f97316', bg: '#fff7ed' }; // Orange
    if (score >= 400) return { stroke: '#eab308', bg: '#fefce8' }; // Yellow
    if (score >= 200) return { stroke: '#22c55e', bg: '#f0fdf4' }; // Green
    return { stroke: '#3b82f6', bg: '#eff6ff' }; // Blue
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const sizeClasses = getSizeClasses();
  const colors = getRiskColor(riskScore);
  const circumference = 2 * Math.PI * 88; // radius = 88 for w-44
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (riskScore / 1000) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Gauge Container */}
      <div className={`relative ${sizeClasses.container} flex items-center justify-center`}>
        {/* Background Circle */}
        <svg className={`${sizeClasses.gauge} transform -rotate-90`} viewBox="0 0 176 176">
          <circle
            cx="88"
            cy="88"
            r="80"
            stroke="#e2e8f0"
            strokeWidth="12"
            fill="transparent"
            className="opacity-50"
          />
          {/* Progress Circle */}
          <circle
            cx="88"
            cy="88"
            r="80"
            stroke={colors.stroke}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke}40)`
            }}
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <div className="text-center">
              <div className={`font-bold ${sizeClasses.text} text-gray-900`}>
                {riskScore}
              </div>
              <div className="text-sm text-gray-500 font-medium">Risk Score</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Risk Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(riskStatus)}`}>
        {riskStatus}
      </div>
    </div>
  );
};

export default RiskGauge;
