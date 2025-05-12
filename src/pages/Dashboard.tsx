import { useState, useEffect } from 'react';
import { FileText, Book, Calendar, Users, Check, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    generatedToday: 0,
    subjectsCovered: 0,
    questionSets: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalQuestions: 1245,
        generatedToday: 78,
        subjectsCovered: 8,
        questionSets: 42
      });
      
      setRecentActivity([
        { 
          id: 1,
          time: new Date(Date.now() - 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          text: '78 JavaScript questions generated', 
          icon: <FileText size={16} /> 
        },
        { 
          id: 2,
          time: new Date(Date.now() - 120 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          text: 'Python Basics question set exported to PDF', 
          icon: <Check size={16} /> 
        },
        { 
          id: 3,
          time: new Date(Date.now() - 180 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          text: 'Added new tag "Algorithms" to question bank', 
          icon: <Activity size={16} /> 
        },
        { 
          id: 4,
          time: 'Yesterday', 
          text: '120 Java questions generated', 
          icon: <FileText size={16} /> 
        },
        { 
          id: 5,
          time: 'Yesterday', 
          text: 'Updated explanation for question #12893', 
          icon: <Check size={16} /> 
        },
      ]);
    }, 1000);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white gradient-text">Dashboard</h1>
        <p className="text-slate-500 dark:text-white mt-2">Welcome to your question generation dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={FileText}
          trend={{ value: "+12%", isPositive: true }}
          description="Since last month"
        />
        <StatCard
          title="Generated Today"
          value={stats.generatedToday}
          icon={Calendar}
          trend={{ value: "+24%", isPositive: true }}
          description="Compared to yesterday"
        />
        <StatCard
          title="Subjects Covered"
          value={stats.subjectsCovered}
          icon={Book}
        />
        <StatCard
          title="Question Sets"
          value={stats.questionSets}
          icon={Users}
          trend={{ value: "+5%", isPositive: true }}
          description="New this week"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <span className="gradient-3d-bg h-8 w-8 rounded-full flex items-center justify-center mr-2 text-white">
              <Activity size={18} />
            </span>
            Recent Activity
          </h2>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon">
                  {item.icon}
                </div>
                <div className="activity-details">
                  <p className="activity-text dark:text-white">{item.text}</p>
                  <p className="activity-time dark:text-slate-300">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <a href="#" className="view-all-link dark:text-white">View all activity</a>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <span className="gradient-3d-bg h-8 w-8 rounded-full flex items-center justify-center mr-2 text-white">
              <FileText size={18} />
            </span>
            Question Distribution
          </h2>
          <div className="language-distribution">
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label dark:text-white">JavaScript</div>
                <div className="distribution-value dark:text-white">45%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill js" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label dark:text-white">Python</div>
                <div className="distribution-value dark:text-white">30%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill py" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label dark:text-white">Java</div>
                <div className="distribution-value dark:text-white">15%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill java" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label dark:text-white">C++</div>
                <div className="distribution-value dark:text-white">10%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill csharp" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <h3 className="section-title mt-6 dark:text-white">Difficulty Distribution</h3>
          <div className="difficulty-distribution">
            <div className="difficulty-box easy">
              <div className="difficulty-content">
                <p className="difficulty-label dark:text-white">Easy</p>
                <p className="difficulty-value dark:text-white">32%</p>
              </div>
            </div>
            <div className="difficulty-box medium">
              <div className="difficulty-content">
                <p className="difficulty-label dark:text-white">Medium</p>
                <p className="difficulty-value dark:text-white">45%</p>
              </div>
            </div>
            <div className="difficulty-box hard">
              <div className="difficulty-content">
                <p className="difficulty-label dark:text-white">Hard</p>
                <p className="difficulty-value dark:text-white">23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
