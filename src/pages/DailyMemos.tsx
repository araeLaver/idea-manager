import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, ArrowLeft, Edit3, Save, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemoEntry {
  date: string;
  memo: string;
}

export function DailyMemos() {
  const [memos, setMemos] = useState<MemoEntry[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editMemo, setEditMemo] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = () => {
    const allMemos: MemoEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('daily-memo-')) {
        const date = key.replace('daily-memo-', '');
        const memo = localStorage.getItem(key);
        if (memo) {
          allMemos.push({ date, memo });
        }
      }
    }
    allMemos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMemos(allMemos);
  };

  const handleEdit = (date: string, memo: string) => {
    setEditingDate(date);
    setEditMemo(memo);
  };

  const handleSave = (date: string) => {
    if (editMemo.trim()) {
      localStorage.setItem(`daily-memo-${date}`, editMemo);
    } else {
      localStorage.removeItem(`daily-memo-${date}`);
    }
    setEditingDate(null);
    setEditMemo('');
    loadMemos();
  };

  const handleCancel = () => {
    setEditingDate(null);
    setEditMemo('');
  };

  const handleDelete = (date: string) => {
    if (confirm('이 메모를 삭제하시겠습니까?')) {
      localStorage.removeItem(`daily-memo-${date}`);
      loadMemos();
    }
  };

  const addNewMemo = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingMemo = memos.find(m => m.date === today);
    
    if (!existingMemo) {
      setEditingDate(today);
      setEditMemo('');
    } else {
      handleEdit(today, existingMemo.memo);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-slide-in-up">
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title="대시보드로 돌아가기"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-4xl font-bold text-primary bg-gradient-hero bg-clip-text text-transparent">
                일일메모
              </h1>
            </div>
            <p className="text-secondary ml-14">매일의 기록을 관리하세요</p>
          </div>
          
          <button
            onClick={addNewMemo}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>새 메모</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {memos.length > 0 ? (
            memos.map(({ date, memo }) => (
              <div key={date} className="card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko })}
                        </h3>
                        <p className="text-sm text-tertiary">
                          {format(new Date(date), 'EEEE', { locale: ko })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {editingDate === date ? (
                        <>
                          <button
                            onClick={() => handleSave(date)}
                            className="p-2 rounded-lg bg-success text-white hover:bg-success-dark transition-colors"
                            title="저장"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg bg-error text-white hover:bg-error/90 transition-colors"
                            title="취소"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(date, memo)}
                            className="p-2 rounded-lg bg-warning text-white hover:bg-warning/90 transition-colors"
                            title="편집"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(date)}
                            className="p-2 rounded-lg bg-error text-white hover:bg-error-dark transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingDate === date ? (
                    <textarea
                      value={editMemo}
                      onChange={(e) => setEditMemo(e.target.value)}
                      placeholder="메모를 작성해주세요..."
                      className="w-full h-32 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      autoFocus
                    />
                  ) : (
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-primary whitespace-pre-wrap leading-relaxed">{memo}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-2">아직 작성된 메모가 없습니다</h3>
              <p className="text-tertiary mb-6">첫 번째 일일메모를 작성해보세요</p>
              <button
                onClick={addNewMemo}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
              >
                <Plus className="h-5 w-5" />
                첫 메모 작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}