
'use client';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  change?: string;
}

export default function StatCard({ title, value, icon, color, change }: StatCardProps) {
  return (
    <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 lg:mb-0">{title}</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-900 lg:mt-2">{value}</p>
          {change && (
            <p className="text-xs lg:text-sm text-green-600 mt-1 truncate">{change}</p>
          )}
        </div>
        <div className={`w-8 h-8 lg:w-12 lg:h-12 ${color} rounded-lg flex items-center justify-center mt-2 lg:mt-0 self-start lg:self-auto`}>
          <i className={`${icon} text-white text-sm lg:text-xl`}></i>
        </div>
      </div>
    </div>
  );
}
