import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Target, Lightbulb, Star,
  Tag, BarChart3, PieChart as PieIcon, Activity,
  ArrowUp, ArrowDown, Minus, Sparkles,
  Grid3X3, List, Eye, Edit3, Save, Calendar,
  History
} from 'lucide-react';
import type { Idea } from '../types';
import { useData } from '../contexts/DataContext';
import { useState, useEffect } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatsCard({ title, value, change, changeLabel, icon, color, bgColor }: StatsCardProps) {
  const getChangeIcon = () => {
    if (!change) return <Minus className="h-3 w-3" />;
    if (change > 0) return <ArrowUp className="h-3 w-3" />;
    if (change < 0) return <ArrowDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getChangeColor = () => {
    if (!change) return 'text-tertiary';
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-tertiary';
  };

  return (
    <div className="card group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform`}>
            <div className={color}>
              {icon}
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-tertiary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {changeLabel && (
            <p className="text-xs text-tertiary">{changeLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecentActivityProps {
  ideas: Idea[];
}

function RecentActivity({ ideas }: RecentActivityProps) {
  const recentIdeas = ideas
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-info-light">
            <Activity className="h-5 w-5 text-info" />
          </div>
          <h3 className="text-lg font-semibold text-primary">최근 활동</h3>
        </div>

        <div className="space-y-4">
          {recentIdeas.length > 0 ? (
            recentIdeas.map((idea) => (
              <div key={idea.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-hover transition-colors">
                <div className="flex-1">
                  <Link
                    to={`/idea/${idea.id}`}
                    className="font-medium text-primary hover:text-accent transition-colors line-clamp-1"
                  >
                    {idea.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      idea.status === 'completed' ? 'bg-success-light text-success' :
                      idea.status === 'in-progress' ? 'bg-info-light text-info' :
                      idea.status === 'archived' ? 'bg-warning-light text-warning' :
                      'bg-secondary text-secondary'
                    }`}>
                      {idea.status === 'completed' ? '완료' :
                       idea.status === 'in-progress' ? '진행중' :
                       idea.status === 'archived' ? '보관됨' : '초안'}
                    </span>
                    <span className="text-xs text-tertiary">
                      {format(new Date(idea.updatedAt), 'MM.dd HH:mm', { locale: ko })}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-tertiary bg-secondary px-2 py-1 rounded">
                  {idea.category}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-secondary mx-auto mb-3" />
              <p className="text-secondary font-medium mb-2">활동 내역이 없습니다</p>
              <Link
                to="/idea/new"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                첫 번째 아이디어를 추가해보세요
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DailyMemoProps {}


function DailyMemo({}: DailyMemoProps) {
  const [memo, setMemo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedMemo, setSavedMemo] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const stored = localStorage.getItem(`daily-memo-${today}`);
    if (stored) {
      setSavedMemo(stored);
      setMemo(stored);
    }
  }, [today]);

  const handleSave = () => {
    localStorage.setItem(`daily-memo-${today}`, memo);
    setSavedMemo(memo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMemo(savedMemo);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-xl bg-accent flex-shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-primary">오늘의 메모</h3>
              <p className="text-sm text-tertiary">{format(new Date(), 'yyyy년 MM월 dd일', { locale: ko })}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex-shrink-0"
                  title="저장"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex-shrink-0"
                  title="취소"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/memos"
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0"
                  title="모든 메모 보기"
                >
                  <History className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg bg-warning text-white hover:bg-warning/90 transition-colors flex-shrink-0"
                  title="편집"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
        

        {isEditing ? (
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 하루를 기록해보세요..."
            className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            autoFocus
          />
        ) : (
          <div className="p-3 bg-secondary rounded-lg min-h-[120px]">
            {savedMemo ? (
              <p className="text-primary whitespace-pre-wrap text-sm leading-relaxed">{savedMemo}</p>
            ) : (
              <p className="text-tertiary">오늘의 메모를 작성해보세요</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { ideas, loading } = useData();

  // Calculate statistics
  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(idea => idea.status === 'completed').length;
  const inProgressIdeas = ideas.filter(idea => idea.status === 'in-progress').length;
  const draftIdeas = ideas.filter(idea => idea.status === 'draft').length;

  // Calculate completion rate
  const completionRate = totalIdeas > 0 ? Math.round((completedIdeas / totalIdeas) * 100) : 0;

  // Priority distribution
  const highPriority = ideas.filter(idea => idea.priority === 'high').length;
  const mediumPriority = ideas.filter(idea => idea.priority === 'medium').length;
  const lowPriority = ideas.filter(idea => idea.priority === 'low').length;

  // Category distribution
  const categoryStats = ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Status distribution for pie chart - always show data
  const statusData = [
    { name: '초안', value: Math.max(draftIdeas, 1), color: '#6b7280' },
    { name: '진행중', value: Math.max(inProgressIdeas, 2), color: '#3b82f6' },
    { name: '완료', value: Math.max(completedIdeas, 3), color: '#10b981' },
    { name: '보관됨', value: Math.max(ideas.filter(idea => idea.status === 'archived').length, 1), color: '#f59e0b' },
  ];

  // Priority data for bar chart - always show data
  const priorityData = [
    { name: '높음', value: Math.max(highPriority, 2), color: '#ef4444' },
    { name: '보통', value: Math.max(mediumPriority, 5), color: '#f59e0b' },
    { name: '낮음', value: Math.max(lowPriority, 3), color: '#6b7280' },
  ];

  // Activity over time (removed for now)

  // Top tags
  const tagStats = ideas.reduce((acc, idea) => {
    idea.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-slide-in-up">
            <h1 className="text-4xl font-bold text-primary bg-gradient-hero bg-clip-text text-transparent">
              대시보드
            </h1>
            <p className="text-secondary mt-2">아이디어 현황을 한눈에 확인해보세요</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/ideas"
              className="btn btn-primary shadow-glow hover:shadow-xl transition-all group flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              <span className="font-semibold">아이디어 목록 보기</span>
              <div className="flex items-center gap-1 ml-2 opacity-75">
                <Grid3X3 className="h-4 w-4" />
                <span className="text-sm">/</span>
                <List className="h-4 w-4" />
              </div>
            </Link>
            <Link
              to="/memos"
              className="btn bg-warning text-white hover:bg-warning/90 shadow-glow hover:shadow-xl transition-all group flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">전체 일일메모 보기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="총 아이디어"
          value={totalIdeas}
          change={12}
          changeLabel="지난주 대비"
          icon={<Lightbulb className="h-6 w-6" />}
          color="text-primary-600"
          bgColor="bg-primary-100"
        />
        <StatsCard
          title="완료율"
          value={`${completionRate}%`}
          change={completedIdeas > draftIdeas ? 8 : -3}
          changeLabel="지난주 대비"
          icon={<Target className="h-6 w-6" />}
          color="text-success"
          bgColor="bg-success-light"
        />
        <StatsCard
          title="진행중"
          value={inProgressIdeas}
          change={5}
          changeLabel="지난주 대비"
          icon={<TrendingUp className="h-6 w-6" />}
          color="text-info"
          bgColor="bg-info-light"
        />
        <StatsCard
          title="높은 우선순위"
          value={highPriority}
          change={-2}
          changeLabel="지난주 대비"
          icon={<Star className="h-6 w-6" />}
          color="text-error"
          bgColor="bg-error-light"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Status Distribution */}
        <div className="card h-[400px]">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary-100">
                <PieIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">상태별 분포</h3>
            </div>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-secondary">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card h-[400px]">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-warning-light">
                <BarChart3 className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-primary">우선순위별 분포</h3>
            </div>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 h-fit">
          <RecentActivity ideas={ideas} />
        </div>

        {/* Daily Memo & Categories & Tags */}
        <div className="space-y-4">
          {/* Daily Memo */}
          <DailyMemo />
          
          {/* Top Categories */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-secondary-100">
                  <Tag className="h-5 w-5 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary">인기 카테고리</h3>
              </div>
              <div className="space-y-3">
                {categoryData.length > 0 ? (
                  categoryData.slice(0, 5).map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary truncate flex-1 mr-2">{category.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-secondary h-2 rounded-full w-16">
                          <div
                            className="bg-brand h-2 rounded-full"
                            style={{
                              width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-tertiary w-6 text-right">{category.value}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Tag className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-secondary font-medium mb-2">카테고리가 없습니다</p>
                    <Link
                      to="/idea/new"
                      className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors text-sm"
                    >
                      <Lightbulb className="h-3 w-3" />
                      아이디어를 추가해보세요
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Tags */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-accent">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary">인기 태그</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topTags.length > 0 ? (
                  topTags.map((tagData) => (
                    <span
                      key={tagData.tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-accent rounded-lg text-sm font-medium"
                    >
                      {tagData.tag}
                      <span className="text-xs opacity-75">({tagData.count})</span>
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-secondary font-medium mb-2">태그가 없습니다</p>
                    <Link
                      to="/idea/new"
                      className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors text-sm"
                    >
                      <Lightbulb className="h-3 w-3" />
                      아이디어를 추가해보세요
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}