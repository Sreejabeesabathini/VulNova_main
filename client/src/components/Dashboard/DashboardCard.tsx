// src/components/Dashboard/DashboardCard.tsx
import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string; // ex: "+12%" or "-8%"
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend = "stable",
  trendValue,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between p-6 h-56">
      {/* Header row */}
      <div className="flex w-full justify-between items-center">
        <Icon className="w-7 h-7 text-purple-500" />
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          {trendValue && (
            <span
              className={`text-sm font-medium ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {trendValue}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 text-center mt-2">
        {title}
      </h3>

      {/* Value */}
      <div className="text-2xl font-bold text-gray-900 text-center my-2">
        {value}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default DashboardCard;
