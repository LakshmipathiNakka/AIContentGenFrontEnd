
import { FileText, Book, Calendar, Users, Check, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome to your MCQ generation dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 sm:grid-cols-2 mb-8">
        <StatCard
          title="Total Questions"
          value="1,245"
          icon={<FileText size={24} />}
          trend={{ value: 12, isPositive: true }}
          description="Since last month"
        />
        <StatCard
          title="Generated Today"
          value="78"
          icon={<Calendar size={24} />}
          trend={{ value: 24, isPositive: true }}
          description="Compared to yesterday"
        />
        <StatCard
          title="Subjects Covered"
          value="8"
          icon={<Book size={24} />}
        />
        <StatCard
          title="Question Sets"
          value="42"
          icon={<Users size={24} />}
          trend={{ value: 5, isPositive: true }}
          description="New this week"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { time: '12:42 PM', text: '78 JavaScript questions generated', icon: <FileText size={16} /> },
              { time: '10:30 AM', text: 'MCQ set "Python Basics" exported to PDF', icon: <Check size={16} /> },
              { time: '9:15 AM', text: 'Added new tag "Algorithms" to question bank', icon: <Activity size={16} /> },
              { time: 'Yesterday', text: '120 Java questions generated', icon: <FileText size={16} /> },
              { time: 'Yesterday', text: 'Updated explanation for question #12893', icon: <Check size={16} /> },
            ].map((item, i) => (
              <div key={i} className="flex">
                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-mcq-light flex items-center justify-center text-mcq-primary">
                  {item.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">{item.text}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-mcq-primary hover:text-mcq-secondary">View all activity</a>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Question Distribution</h2>
          <div className="mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-slate-700">JavaScript</div>
                  <div className="text-sm font-medium text-slate-700">45%</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-mcq-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-slate-700">Python</div>
                  <div className="text-sm font-medium text-slate-700">30%</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-mcq-secondary h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-slate-700">Java</div>
                  <div className="text-sm font-medium text-slate-700">15%</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-mcq-tertiary h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-slate-700">C#</div>
                  <div className="text-sm font-medium text-slate-700">10%</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-slate-700 mb-4">Difficulty Distribution</h3>
          <div className="flex gap-2">
            <div className="w-1/3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-center">
                <p className="text-xs text-green-800 font-medium">Easy</p>
                <p className="text-xl font-bold text-green-600 mt-1">32%</p>
              </div>
            </div>
            <div className="w-1/3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-center">
                <p className="text-xs text-amber-800 font-medium">Medium</p>
                <p className="text-xl font-bold text-amber-600 mt-1">45%</p>
              </div>
            </div>
            <div className="w-1/3 p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-center">
                <p className="text-xs text-red-800 font-medium">Hard</p>
                <p className="text-xl font-bold text-red-600 mt-1">23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
