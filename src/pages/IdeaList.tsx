import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Tag, TrendingUp, Archive, FileText, Trash2, Grid3X3, List, Eye } from 'lucide-react';
import type { Idea } from '../types';
import { storage } from '../utils/storage';
import { Dashboard } from '../components/Dashboard';

export function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const storedIdeas = await storage.getIdeas();
      setIdeas(storedIdeas);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 아이디어를 삭제하시겠습니까?')) {
      try {
        await storage.deleteIdea(id);
        loadIdeas();
      } catch (error) {
        console.error('Failed to delete idea:', error);
        alert('아이디어 삭제에 실패했습니다.');
      }
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filter === 'all') return true;
    return idea.status === filter;
  });

  const getStatusColor = (status: Idea['status']) => {
    switch (status) {
      case 'draft': return 'bg-slate-700/50 text-slate-300 border border-slate-600';
      case 'in-progress': return 'bg-blue-900/30 text-blue-300 border border-blue-700';
      case 'completed': return 'bg-emerald-900/30 text-emerald-300 border border-emerald-700';
      case 'archived': return 'bg-yellow-900/30 text-yellow-300 border border-yellow-700';
    }
  };

  const getPriorityColor = (priority: Idea['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
    }
  };

  const getStatusLabel = (status: Idea['status']) => {
    switch (status) {
      case 'draft': return '초안';
      case 'in-progress': return '진행중';
      case 'completed': return '완료';
      case 'archived': return '보관됨';
    }
  };

  return (
    <div>
      <Dashboard ideas={ideas} />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">아이디어 목록</h1>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'card' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'}`}
          >
            전체 ({ideas.length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${filter === 'draft' ? 'bg-slate-600 text-white shadow-lg shadow-slate-600/20' : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'}`}
          >
            초안 ({ideas.filter(i => i.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${filter === 'in-progress' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'}`}
          >
            진행중 ({ideas.filter(i => i.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${filter === 'completed' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'}`}
          >
            완료 ({ideas.filter(i => i.status === 'completed').length})
          </button>
        </div>
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-white">아이디어가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-400">새로운 아이디어를 추가해보세요.</p>
          <div className="mt-6">
            <Link
              to="/new"
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              새 아이디어 추가
            </Link>
          </div>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
              <Link to={`/idea/${idea.id}`} className="block p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white line-clamp-1">{idea.title}</h3>
                  <TrendingUp className={`h-5 w-5 ${getPriorityColor(idea.priority)}`} />
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{idea.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                    {getStatusLabel(idea.status)}
                  </span>
                  <span className="text-sm text-gray-400">{idea.category}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {idea.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-700/50 text-gray-300 border border-gray-600">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{idea.tags.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(idea.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                </div>
              </Link>
              <div className="px-6 pb-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(idea.id);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">아이디어</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">우선순위</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">생성일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                {filteredIdeas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 min-w-0">
                          <Link to={`/idea/${idea.id}`} className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                            {idea.title}
                          </Link>
                          <p className="text-sm text-gray-400 line-clamp-1 mt-1">{idea.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {idea.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700/50 text-gray-300 border border-gray-600">
                                {tag}
                              </span>
                            ))}
                            {idea.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{idea.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{idea.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                        {getStatusLabel(idea.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${getPriorityColor(idea.priority)}`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {idea.priority === 'high' ? '높음' : idea.priority === 'medium' ? '보통' : '낮음'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(idea.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/idea/${idea.id}`}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-900/20 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}