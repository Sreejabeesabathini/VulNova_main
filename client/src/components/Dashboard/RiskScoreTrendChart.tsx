import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

const data = [
  { month: "Aug", score: 850 },
  { month: "Sep", score: 820 },
  { month: "Oct", score: 780 },
  { month: "Nov", score: 650 },
  { month: "Dec", score: 720 },
  { month: "Jan", score: 680 },
];

// ✅ Custom label renderer for dynamic colors
const CustomLabel = (props: any) => {
  const { x, y, value, index, data } = props;

  // Compare with previous month
  let color = "#6b7280"; // gray-500 default
  if (index > 0) {
    const prev = data[index - 1].score;
    if (value > prev) color = "#16a34a"; // green-600
    else if (value < prev) color = "#dc2626"; // red-600
  }

  return (
    <text
      x={x}
      y={y - 6} // offset above dot
      fill={color}
      fontSize={11}
      fontWeight={600}
      textAnchor="middle"
    >
      {value}
    </text>
  );
};

const RiskScoreTrendChart: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-gray-900">
          Risk Score Trend
        </h3>
        <span className="text-sm text-red-600">↓ -5.6%</span>
      </div>

      {/* Chart */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={data}
            margin={{ top: 30, right: 20, left: 10, bottom: 10 }}
          >
            <XAxis dataKey="month" />
            <YAxis hide />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2563eb" }}
            >
              {/* ✅ Dynamic colored labels */}
              <LabelList
                content={<CustomLabel data={data} />}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latest Score */}
      <div className="text-center font-bold text-xl mt-1">
        {data[data.length - 1].score}
      </div>
      <p className="text-xs text-gray-600 text-center">
        Last 6 months trend (Aug - Jan)
      </p>
    </div>
  );
};

export default RiskScoreTrendChart;
