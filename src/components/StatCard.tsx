
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => {
  return (
    <div className="stats-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-slate-800">{value}</h4>
        </div>
        <div className="p-2 bg-mcq-light rounded-lg text-mcq-primary">
          {icon}
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center">
          {trend && (
            <span className={`text-xs font-medium mr-2 px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
