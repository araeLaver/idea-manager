import { useState, useEffect } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  Calendar, Save, Trash2, Edit, Tag, 
  Sun, Cloud, CloudRain, ChevronLeft, ChevronRight,
  Target, Award, BookOpen, Smile, Meh, Frown, ArrowLeft, Heart
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { storage } from '../utils/storage';

const MOOD_ICONS = {
  excellent: { icon: Smile, color: 'text-green-500', label: '최고' },
  good: { icon: Smile, color: 'text-blue-500', label: '좋음' },
  neutral: { icon: Meh, color: 'text-yellow-500', label: '보통' },
  bad: { icon: Frown, color: 'text-orange-500', label: '나쁨' },
  terrible: { icon: Frown, color: 'text-red-500', label: '최악' },
};

const WEATHER_OPTIONS = [
  { value: 'sunny', icon: Sun, label: '맑음' },
  { value: 'cloudy', icon: Cloud, label: '흐림' },
  { value: 'rainy', icon: CloudRain, label: '비' },
];

export function DailyMemoPage() {
  const { date } = useParams();
  const [selectedDate, setSelectedDate] = useState(date ? parseISO(date) : new Date());
  const [memo, setMemo] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    mood: '' as any,
    weather: '',
    goals: [''],
    achievements: [''],
    reflections: '',
    tags: [''],
  });

  useEffect(() => {
    if (date) {
      setSelectedDate(parseISO(date));
    }
  }, [date]);

  useEffect(() => {
    loadMemo();
  }, [selectedDate]);

  const loadMemo = async () => {
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingMemo = await storage.getMemo(dateString);
      setMemo(existingMemo);
      
      if (existingMemo) {
        setFormData({
          content: existingMemo.content || '',
          mood: existingMemo.mood || '',
          weather: existingMemo.weather || '',
          goals: existingMemo.goals?.length ? existingMemo.goals : [''],
          achievements: existingMemo.achievements?.length ? existingMemo.achievements : [''],
          reflections: existingMemo.reflections || '',
          tags: existingMemo.tags?.length ? existingMemo.tags : [''],
        });
        setIsEditing(false);
      } else {
        setFormData({
          content: '',
          mood: '',
          weather: '',
          goals: [''],
          achievements: [''],
          reflections: '',
          tags: [''],
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to load memo:', error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(parseISO(e.target.value));
  };

  const handleSave = async () => {
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const cleanFormData = {
        ...formData,
        goals: formData.goals.filter(g => g.trim()),
        achievements: formData.achievements.filter(a => a.trim()),
        tags: formData.tags.filter(t => t.trim()),
      };

      const memoData = {
        date: dateString,
        content: cleanFormData.content,
        mood: cleanFormData.mood || undefined,
        weather: cleanFormData.weather || undefined,
        goals: cleanFormData.goals,
        achievements: cleanFormData.achievements,
        reflections: cleanFormData.reflections || undefined,
        tags: cleanFormData.tags,
        isFavorite: memo?.isFavorite || false,
      };

      await storage.saveMemo(memoData);
      await loadMemo();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save memo:', error);
      alert('메모 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (memo && confirm('이 메모를 삭제하시겠습니까?')) {
      try {
        await storage.deleteMemo(memo.id);
        await loadMemo();
      } catch (error) {
        console.error('Failed to delete memo:', error);
        alert('메모 삭제에 실패했습니다.');
      }
    }
  };

  const addListItem = (field: 'goals' | 'achievements' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'goals' | 'achievements' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'goals' | 'achievements' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/memos" className="text-gray-400 hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">메모</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </button>
          <div className="relative">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {format(selectedDate, 'yyyy년 MM월 dd일 (eeee)', { locale: ko })}
          </h2>
          {memo?.isFavorite && <Heart className="w-6 h-6 text-red-400 fill-current" />}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">오늘의 기분</label>
                <div className="flex gap-2">
                  {Object.entries(MOOD_ICONS).map(([mood, { icon: Icon, color, label }]) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mood: mood as any }))}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.mood === mood 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">날씨</label>
                <div className="flex gap-2">
                  {WEATHER_OPTIONS.map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, weather: value }))}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.weather === value 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">오늘의 메모</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="오늘 하루는 어떠셨나요? 자유롭게 기록해보세요..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">오늘의 목표</label>
                <button
                  type="button"
                  onClick={() => addListItem('goals')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + 추가
                </button>
              </div>
              <div className="space-y-2">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateListItem('goals', index, e.target.value)}
                      className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="목표를 입력하세요..."
                    />
                    {formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('goals', index)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">오늘의 성취</label>
                <button
                  type="button"
                  onClick={() => addListItem('achievements')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + 추가
                </button>
              </div>
              <div className="space-y-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateListItem('achievements', index, e.target.value)}
                      className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="성취한 일을 입력하세요..."
                    />
                    {formData.achievements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('achievements', index)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">오늘의 회고</label>
              <textarea
                value={formData.reflections}
                onChange={(e) => setFormData(prev => ({ ...prev, reflections: e.target.value }))}
                rows={3}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="오늘 하루를 되돌아보며 느낀 점을 적어보세요..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">태그</label>
                <button
                  type="button"
                  onClick={() => addListItem('tags')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + 추가
                </button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateListItem('tags', index, e.target.value)}
                      className="flex-1 p-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="태그를 입력하세요..."
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('tags', index)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 flex items-center gap-2 transition-all duration-200 shadow-lg shadow-blue-600/25"
              >
                <Save className="h-4 w-4" />
                저장
              </button>
              {memo && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {memo ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {memo.mood && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">기분:</span>
                      {(() => {
                        const MoodIcon = MOOD_ICONS[memo.mood]?.icon || Meh;
                        return (
                          <div className="flex items-center gap-1">
                            <MoodIcon className={`w-5 h-5 ${MOOD_ICONS[memo.mood]?.color}`} />
                            <span className="text-sm">{MOOD_ICONS[memo.mood]?.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {memo.weather && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">날씨:</span>
                      {(() => {
                        const weatherOption = WEATHER_OPTIONS.find(w => w.value === memo.weather);
                        if (weatherOption) {
                          const WeatherIcon = weatherOption.icon;
                          return (
                            <div className="flex items-center gap-1">
                              <WeatherIcon className="w-5 h-5 text-gray-600" />
                              <span className="text-sm">{weatherOption.label}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>

                {memo.content && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {memo.content}
                    </div>
                  </div>
                )}

                {memo.goals?.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                      <Target className="w-5 h-5 text-blue-400" />
                      오늘의 목표
                    </h3>
                    <ul className="space-y-2">
                      {memo.goals.map((goal: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {memo.achievements?.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                      <Award className="w-5 h-5 text-emerald-400" />
                      오늘의 성취
                    </h3>
                    <ul className="space-y-2">
                      {memo.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {memo.reflections && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      오늘의 회고
                    </h3>
                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {memo.reflections}
                      </div>
                    </div>
                  </div>
                )}

                {memo.tags?.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                      <Tag className="w-5 h-5 text-indigo-400" />
                      태그
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {memo.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm border border-indigo-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white flex items-center gap-2 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 hover:text-red-200 flex items-center gap-2 transition-all duration-200 border border-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 mb-4">이 날짜에 작성된 메모가 없습니다.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-600/25"
                >
                  메모 작성하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}