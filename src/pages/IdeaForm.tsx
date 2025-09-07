import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Calendar, Clock } from 'lucide-react';
import type { IdeaFormData, Idea } from '../types';
import { useData } from '../contexts/DataContext';
import { AIFeatures } from '../components/AIFeatures';

export function IdeaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { createIdea, updateIdea, getIdea } = useData();

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    status: 'draft',
    priority: 'medium',
    notes: '',
    targetMarket: '',
    potentialRevenue: '',
    resources: '',
    timeline: ''
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      getIdea(id).then(idea => {
        if (idea) {
          setFormData({
            title: idea.title,
            description: idea.description,
            category: idea.category,
            tags: idea.tags,
            status: idea.status,
            priority: idea.priority,
            notes: idea.notes || '',
            targetMarket: idea.targetMarket || '',
            potentialRevenue: idea.potentialRevenue || '',
            resources: idea.resources || '',
            timeline: idea.timeline || ''
          });
        } else {
          navigate('/');
        }
      });
    }
  }, [id, isEdit, navigate, getIdea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit && id) {
        await updateIdea(id, formData);
      } else {
        await createIdea(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('아이디어 저장 실패:', error);
      alert('아이디어 저장에 실패했습니다.');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
  };

  const handleTagsSelect = (tags: string[]) => {
    const newTags = [...formData.tags];
    tags.forEach(tag => {
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    });
    setFormData({ ...formData, tags: newTags });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const updateTimeline = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const startDateStr = start.toLocaleDateString('ko-KR');
      const endDateStr = end.toLocaleDateString('ko-KR');
      
      const timelineText = `${startDateStr} ~ ${endDateStr} (${diffDays}일간, ${startTime} - ${endTime})`;
      setFormData(prev => ({ ...prev, timeline: timelineText }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          목록으로
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? '아이디어 수정' : '새 아이디어'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="아이디어 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="아이디어에 대한 설명을 입력하세요"
            />
          </div>

          {/* AI Features */}
          <AIFeatures
            title={formData.title}
            description={formData.description}
            onCategorySelect={handleCategorySelect}
            onTagsSelect={handleTagsSelect}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 웹서비스, 모바일앱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Idea['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">초안</option>
                <option value="in-progress">진행중</option>
                <option value="completed">완료</option>
                <option value="archived">보관됨</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              우선순위
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Idea['priority'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="태그를 입력하고 Enter를 누르세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              타겟 시장
            </label>
            <textarea
              value={formData.targetMarket}
              onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="대상 고객층과 시장 규모를 설명하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예상 수익
            </label>
            <input
              type="text"
              value={formData.potentialRevenue}
              onChange={(e) => setFormData({ ...formData, potentialRevenue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예상 수익 모델과 규모"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              필요 자원
            </label>
            <textarea
              value={formData.resources}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="필요한 인력, 자금, 기술 등"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 일정
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 시작일 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    updateTimeline();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* 종료일 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  종료일 (예상)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    updateTimeline();
                  }}
                  min={startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* 시작 시간 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  작업 시작 시간
                </label>
                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    updateTimeline();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={i} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* 종료 시간 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  작업 종료 시간
                </label>
                <select
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    updateTimeline();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={i} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            {/* 자동 생성된 타임라인 텍스트 */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                타임라인 요약
              </label>
              <textarea
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="자동 생성된 타임라인 또는 직접 입력"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="추가 메모나 아이디어"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEdit ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}