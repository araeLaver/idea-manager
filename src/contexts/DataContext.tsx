import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Idea, IdeaFormData } from '../types';
import { storage } from '../utils/storage';
// import { firebaseService } from '../services/firebaseService';

interface DataContextType {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  createIdea: (idea: IdeaFormData) => Promise<Idea>;
  updateIdea: (id: string, idea: Partial<IdeaFormData>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  getIdea: (id: string) => Promise<Idea | null>;
  searchIdeas: (query: string) => Promise<Idea[]>;
  refreshIdeas: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 아이디어 목록 새로고침 (로컬 스토리지만 사용)
  const refreshIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const localIdeas = storage.getIdeas();
      setIdeas(localIdeas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ideas');
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  // 아이디어 생성 (로컬 스토리지만 사용)
  const createIdea = async (ideaData: IdeaFormData): Promise<Idea> => {
    try {
      const newIdea = storage.createIdea(ideaData);
      setIdeas(storage.getIdeas());
      return newIdea;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea');
      throw err;
    }
  };

  // 아이디어 업데이트 (로컬 스토리지만 사용)
  const updateIdea = async (id: string, ideaData: Partial<IdeaFormData>): Promise<void> => {
    try {
      storage.updateIdea(id, ideaData);
      setIdeas(storage.getIdeas());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea');
      throw err;
    }
  };

  // 아이디어 삭제 (로컬 스토리지만 사용)
  const deleteIdea = async (id: string): Promise<void> => {
    try {
      storage.deleteIdea(id);
      setIdeas(storage.getIdeas());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea');
      throw err;
    }
  };

  // 단일 아이디어 가져오기 (로컬 스토리지만 사용)
  const getIdea = async (id: string): Promise<Idea | null> => {
    try {
      return storage.getIdea(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get idea');
      return null;
    }
  };

  // 아이디어 검색 (로컬 스토리지만 사용)
  const searchIdeas = async (query: string): Promise<Idea[]> => {
    try {
      const allIdeas = storage.getIdeas();
      const lowercaseQuery = query.toLowerCase();
      return allIdeas.filter(idea =>
        idea.title.toLowerCase().includes(lowercaseQuery) ||
        idea.description.toLowerCase().includes(lowercaseQuery) ||
        idea.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search ideas');
      return [];
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    refreshIdeas();
  }, []);

  const value: DataContextType = {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    getIdea,
    searchIdeas,
    refreshIdeas,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}