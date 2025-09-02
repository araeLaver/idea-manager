import { FileText, Clock, CheckCircle, Archive, TrendingUp, Calendar, Target } from 'lucide-react';
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

  const priorityCounts = {
    high: ideas.filter(idea => idea.priority === 'high').length,
    medium: ideas.filter(idea => idea.priority === 'medium').length,
    low: ideas.filter(idea => idea.priority === 'low').length,
  };

  const recentIdeas = ideas
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const completionRate = ideas.length > 0 ? Math.round((statusCounts.completed / ideas.length) * 100) : 0;

  const cardStyle = "bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl";

  return (
    <div className="mb-8">
      {/* 메인 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">초안</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.draft}</p>
            </div>
          </div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">진행중</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['in-progress']}</p>
            </div>
          </div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">완료</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
            </div>
          </div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Archive className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">총 아이디어</p>
              <p className="text-2xl font-bold text-gray-900">{ideas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 통계 및 인사이트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 진행률 */}
        <div className={`${cardStyle} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            완료율
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
              <div className="text-sm text-gray-600">
                {statusCounts.completed} / {ideas.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {completionRate >= 75 ? '훌륭해요!' : completionRate >= 50 ? '잘 하고 있어요!' : '더 노력해봐요!'}
            </p>
          </div>
        </div>

        {/* 우선순위 분포 */}
        <div className={`${cardStyle} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
            우선순위 분포
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">높음</span>
              </div>
              <span className="font-semibold text-gray-900">{priorityCounts.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">보통</span>
              </div>
              <span className="font-semibold text-gray-900">{priorityCounts.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">낮음</span>
              </div>
              <span className="font-semibold text-gray-900">{priorityCounts.low}</span>
            </div>
          </div>
        </div>

        {/* 최근 아이디어 */}
        <div className={`${cardStyle} p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            최근 아이디어
          </h3>
          <div className="space-y-3">
            {recentIdeas.length > 0 ? recentIdeas.map((idea) => (
              <div key={idea.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm line-clamp-1">{idea.title}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    idea.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    idea.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    idea.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {idea.status === 'draft' ? '초안' :
                     idea.status === 'in-progress' ? '진행중' :
                     idea.status === 'completed' ? '완료' : '보관됨'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{idea.category}</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">아직 아이디어가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
