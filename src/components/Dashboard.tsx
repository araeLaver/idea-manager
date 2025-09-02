import { FileText, Clock, CheckCircle, TrendingUp, Zap, Target } from 'lucide-react';
import type { Idea } from '../types';

interface DashboardProps {
  ideas: Idea[];
}

export function Dashboard({ ideas }: DashboardProps) {
  const statusCounts = {
    draft: ideas.filter(idea => idea.status === 'draft').length,
    'in-progress': ideas.filter(idea => idea.status === 'in-progress').length,
    completed: ideas.filter(idea => idea.status === 'completed').length,
    archived: ideas.filter(idea => idea.status === 'archived').length,
  };

  const completionRate = ideas.length > 0 ? Math.round((statusCounts.completed / ideas.length) * 100) : 0;
  const highPriorityCount = ideas.filter(idea => idea.priority === 'high').length;

  const stats = [
    {
      title: '초안',
      count: statusCounts.draft,
      icon: FileText,
      color: 'from-slate-500 to-slate-600',
      iconColor: 'text-slate-300',
      bgColor: 'bg-slate-800/50',
      borderColor: 'border-slate-700'
    },
    {
      title: '진행중',
      count: statusCounts['in-progress'],
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-300',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-700'
    },
    {
      title: '완료',
      count: statusCounts.completed,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      iconColor: 'text-emerald-300',
      bgColor: 'bg-emerald-900/30',
      borderColor: 'border-emerald-700'
    },
    {
      title: '전체',
      count: ideas.length,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-300',
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-700'
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* 메인 통계 카드들 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-white text-3xl font-bold">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 추가 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 완료율 */}
        <div className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">완료율</h3>
            <Target className="h-5 w-5 text-green-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 높은 우선순위 아이디어 */}
        <div className="bg-orange-900/30 border border-orange-700 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">높은 우선순위</h3>
            <Zap className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{highPriorityCount}</span>
            <span className="text-orange-400 text-sm">개의 아이디어</span>
          </div>
        </div>

        {/* 활성 비율 */}
        <div className="bg-indigo-900/30 border border-indigo-700 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">활성 아이디어</h3>
            <TrendingUp className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{statusCounts['in-progress'] + statusCounts.draft}</span>
            <span className="text-indigo-400 text-sm">개 진행중</span>
          </div>
        </div>
      </div>
    </div>
  );
}
