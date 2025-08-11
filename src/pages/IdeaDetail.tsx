import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Tag, TrendingUp, 
  Target, DollarSign, Clock, Briefcase
} from 'lucide-react';
import type { Idea } from '../types';
import { storage } from '../utils/storage';

export function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);

  useEffect(() => {
    if (id) {
      const storedIdea = storage.getIdea(id);
      if (storedIdea) {
        setIdea(storedIdea);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (id && confirm('이 아이디어를 삭제하시겠습니까?')) {
      storage.deleteIdea(id);
      navigate('/');
    }
  };

  if (!idea) return null;

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

  const getPriorityLabel = (priority: Idea['priority']) => {
    switch (priority) {
      case 'low': return '낮음';
      case 'medium': return '보통';
      case 'high': return '높음';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          목록으로
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/edit/${id}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(idea.status)}`}>
                {getStatusLabel(idea.status)}
              </span>
              <div className={`flex items-center ${getPriorityColor(idea.priority)}`}>
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">{getPriorityLabel(idea.priority)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              생성: {format(new Date(idea.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              수정: {format(new Date(idea.updatedAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 mr-2">카테고리:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800">
              {idea.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">설명</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
        </div>

        {idea.targetMarket && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              타겟 시장
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{idea.targetMarket}</p>
          </div>
        )}

        {idea.potentialRevenue && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              예상 수익
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{idea.potentialRevenue}</p>
          </div>
        )}

        {idea.resources && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              필요 자원
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{idea.resources}</p>
          </div>
        )}

        {idea.timeline && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              타임라인
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{idea.timeline}</p>
          </div>
        )}

        {idea.notes && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">메모</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{idea.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}