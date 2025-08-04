import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Calculator, TrendingUp } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  increment: number;
}

const statsData: StatItem[] = [
  { icon: Users, label: 'Active Users', value: 1247, suffix: '+', increment: 3 },
  { icon: MessageSquare, label: 'Questions Answered', value: 15432, suffix: '', increment: 7 },
  { icon: Calculator, label: 'Zakat Calculated', value: 892, suffix: 'M', increment: 2 },
  { icon: TrendingUp, label: 'Investments Screened', value: 234, suffix: 'K', increment: 5 }
];

export default function RealTimeStats() {
  const [stats, setStats] = useState(statsData);
  const [recentActivity, setRecentActivity] = useState<string[]>([
    "Ahmed from UAE just calculated Zakat",
    "Fatima from Malaysia asked about crypto",
    "Omar from UK screened halal stocks"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * stat.increment)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activities = [
      "Ahmed from UAE just calculated Zakat",
      "Fatima from Malaysia asked about crypto",
      "Omar from UK screened halal stocks",
      "Aisha from Canada checked investment",
      "Hassan from Egypt asked about Riba",
      "Zainab from Indonesia used Zakat tool",
      "Yusuf from Turkey screened mutual funds",
      "Mariam from Qatar calculated Nisab"
    ];

    const activityInterval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
    }, 8000);

    return () => clearInterval(activityInterval);
  }, []);

  return (
    <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Live Activity</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-teal/10 rounded-lg mx-auto mb-2">
              <stat.icon className="h-5 w-5 text-brand-teal" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {stat.value.toLocaleString()}{stat.suffix}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Activity</h4>
        {recentActivity.map((activity, index) => (
          <div
            key={`${activity}-${index}`}
            className={`text-sm text-muted-foreground transition-all duration-500 ${
              index === 0 ? 'animate-fade-in-up text-foreground font-medium' : ''
            }`}
          >
            • {activity}
          </div>
        ))}
      </div>
    </div>
  );
}