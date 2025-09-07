import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, TrendingUp, FileText, Trash2, Grid3X3, List, Eye, PlusCircle } from 'lucide-react';
import type { Idea } from '../types';
import { useData } from '../contexts/DataContext';

export function IdeaList() {
  const { ideas, loading, deleteIdea } = useData();
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const handleDelete = async (id: string) => {
    if (confirm('이 아이디어를 삭제하시겠습니까?')) {
      try {
        await deleteIdea(id);
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
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: Idea['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary">아이디어를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6">
          <div className="animate-slide-in-up mb-4">
            <h1 className="text-4xl font-bold text-primary bg-gradient-hero bg-clip-text text-transparent">
              아이디어 목록
            </h1>
            <p className="text-secondary mt-2">창의적인 아이디어들을 체계적으로 관리해보세요</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="flex bg-tertiary rounded-xl p-1 shadow-lg border border-primary gap-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-sm ${
                  viewMode === 'card' 
                    ? 'bg-brand text-white shadow-md' 
                    : 'text-primary hover:text-accent hover:bg-hover'
                }`}
                title="카드 보기"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>카드형</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-sm ${
                  viewMode === 'list' 
                    ? 'bg-brand text-white shadow-md' 
                    : 'text-primary hover:text-accent hover:bg-hover'
                }`}
                title="목록 보기"
              >
                <List className="h-4 w-4" />
                <span>목록형</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <button
            onClick={() => setFilter('all')}
            className={`btn transition-all ${
              filter === 'all' 
                ? 'btn-primary shadow-glow' 
                : 'btn-secondary hover:scale-105'
            }`}
          >
            전체 <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">{ideas.length}</span>
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`btn transition-all ${
              filter === 'draft' 
                ? 'btn-primary shadow-glow' 
                : 'btn-secondary hover:scale-105'
            }`}
          >
            초안 <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">{ideas.filter(i => i.status === 'draft').length}</span>
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`btn transition-all ${
              filter === 'in-progress' 
                ? 'btn-primary shadow-glow' 
                : 'btn-secondary hover:scale-105'
            }`}
          >
            진행중 <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">{ideas.filter(i => i.status === 'in-progress').length}</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn transition-all ${
              filter === 'completed' 
                ? 'btn-primary shadow-glow' 
                : 'btn-secondary hover:scale-105'
            }`}
          >
            완료 <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">{ideas.filter(i => i.status === 'completed').length}</span>
          </button>
        </div>
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16 card animate-bounce-in">
          <FileText className="mx-auto h-16 w-16 text-tertiary mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">아이디어가 없습니다</h3>
          <p className="text-secondary mb-8">새로운 아이디어를 추가해서 창의적인 여정을 시작해보세요.</p>
          <Link
            to="/new"
            className="btn btn-primary shadow-glow hover:scale-105 transition-all"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            첫 번째 아이디어 추가
          </Link>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-fade-in">
          {filteredIdeas.map((idea, index) => (
            <div 
              key={idea.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group" 
              style={{animationDelay: `${index * 50}ms`}}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link 
                    to={`/idea/${idea.id}`}
                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex-1 mr-3"
                  >
                    {idea.title}
                  </Link>
                  <div className={`p-2 rounded-lg ${getPriorityColor(idea.priority)} bg-opacity-10`}>
                    <TrendingUp className={`h-5 w-5 ${getPriorityColor(idea.priority)}`} />
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                  {idea.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(idea.status)}`}>
                      {getStatusLabel(idea.status)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {idea.category}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        +{idea.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(idea.createdAt), 'MM.dd', { locale: ko })}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/idea/${idea.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="상세보기"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {filteredIdeas.map((idea, index) => (
            <div 
              key={idea.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6" 
              style={{animationDelay: `${index * 30}ms`}}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <Link 
                      to={`/idea/${idea.id}`} 
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mr-4"
                    >
                      {idea.title}
                    </Link>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(idea.status)}`}>
                        {getStatusLabel(idea.status)}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {idea.category}
                      </span>
                      <div className={`p-2 rounded-lg ${getPriorityColor(idea.priority)} bg-opacity-10`}>
                        <TrendingUp className={`h-4 w-4 ${getPriorityColor(idea.priority)}`} />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {idea.tags.length > 4 && (
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            +{idea.tags.length - 4}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(idea.createdAt), 'yyyy.MM.dd', { locale: ko })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/idea/${idea.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="상세보기"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}