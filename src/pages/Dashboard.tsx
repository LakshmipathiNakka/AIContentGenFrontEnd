
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
  
  // Mock function to simulate loading data from a backend
  useEffect(() => {
    // Simulate API call to get stats
    setTimeout(() => {
      // In a real app, these would come from your backend API
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
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to your question generation dashboard</p>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions.toString()}
          icon={<FileText size={24} />}
          trend={{ value: 12, isPositive: true }}
          description="Since last month"
        />
        <StatCard
          title="Generated Today"
          value={stats.generatedToday.toString()}
          icon={<Calendar size={24} />}
          trend={{ value: 24, isPositive: true }}
          description="Compared to yesterday"
        />
        <StatCard
          title="Subjects Covered"
          value={stats.subjectsCovered.toString()}
          icon={<Book size={24} />}
        />
        <StatCard
          title="Question Sets"
          value={stats.questionSets.toString()}
          icon={<Users size={24} />}
          trend={{ value: 5, isPositive: true }}
          description="New this week"
        />
      </div>
      
      <div className="dashboard-content">
        <div className="activity-card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon">
                  {item.icon}
                </div>
                <div className="activity-details">
                  <p className="activity-text">{item.text}</p>
                  <p className="activity-time">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <a href="#" className="view-all-link">View all activity</a>
          </div>
        </div>
        
        <div className="distribution-card">
          <h2 className="card-title">Question Distribution</h2>
          <div className="language-distribution">
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label">JavaScript</div>
                <div className="distribution-value">45%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill js" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label">Python</div>
                <div className="distribution-value">30%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill py" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label">Java</div>
                <div className="distribution-value">15%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill java" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-header">
                <div className="distribution-label">C#</div>
                <div className="distribution-value">10%</div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill csharp" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <h3 className="section-title">Difficulty Distribution</h3>
          <div className="difficulty-distribution">
            <div className="difficulty-box easy">
              <div className="difficulty-content">
                <p className="difficulty-label">Easy</p>
                <p className="difficulty-value">32%</p>
              </div>
            </div>
            <div className="difficulty-box medium">
              <div className="difficulty-content">
                <p className="difficulty-label">Medium</p>
                <p className="difficulty-value">45%</p>
              </div>
            </div>
            <div className="difficulty-box hard">
              <div className="difficulty-content">
                <p className="difficulty-label">Hard</p>
                <p className="difficulty-value">23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
