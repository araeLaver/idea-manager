import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, FileText, Smile, Meh, Frown, Star } from 'lucide-react';
import { storage } from '../utils/storage';

const MOOD_ICONS = {
  excellent: { icon: Smile, color: 'text-green-500', label: '최고' },
  good: { icon: Smile, color: 'text-blue-500', label: '좋음' },
  neutral: { icon: Meh, color: 'text-yellow-500', label: '보통' },
  bad: { icon: Frown, color: 'text-orange-500', label: '나쁨' },
  terrible: { icon: Frown, color: 'text-red-500', label: '최악' },
};

export function MemoListPage() {
  const [memos, setMemos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      setIsLoading(true);
      const allMemos = await storage.getMemos();
      // 날짜 내림차순으로 정렬
      const sortedMemos = allMemos.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMemos(sortedMemos);
    } catch (error) {
      console.error('Failed to load memos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">메모를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">메모 목록</h1>
        <Link
          to="/memos/new"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-600/25"
        >
          새 메모 작성
        </Link>
      </div>

      {memos.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">작성된 메모가 없습니다</h3>
          <p className="text-gray-400 mb-6">첫 번째 메모를 작성해보세요.</p>
          <Link
            to="/memos/new"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            메모 작성하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {memos.map((memo) => (
            <Link
              key={memo.id}
              to={`/memos/${memo.date}`}
              className="block bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">
                      {format(new Date(memo.date), 'yyyy년 MM월 dd일 (eeee)', { locale: ko })}
                    </h3>
                    {memo.isFavorite && (
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    )}
                  </div>
                  {memo.mood && (
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const MoodIcon = MOOD_ICONS[memo.mood]?.icon || Meh;
                        return (
                          <>
                            <MoodIcon className={`h-5 w-5 ${MOOD_ICONS[memo.mood]?.color}`} />
                            <span className="text-sm text-gray-400">
                              {MOOD_ICONS[memo.mood]?.label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {memo.content && (
                  <p className="text-gray-300 mb-3 line-clamp-2">
                    {memo.content.length > 100 
                      ? `${memo.content.substring(0, 100)}...` 
                      : memo.content
                    }
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {memo.goals?.length > 0 && (
                    <span>목표 {memo.goals.length}개</span>
                  )}
                  {memo.achievements?.length > 0 && (
                    <span>성취 {memo.achievements.length}개</span>
                  )}
                  {memo.tags?.length > 0 && (
                    <span>태그 {memo.tags.length}개</span>
                  )}
                </div>

                {memo.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {memo.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs border border-blue-700"
                      >
                        #{tag}
                      </span>
                    ))}
                    {memo.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{memo.tags.length - 3}개</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}