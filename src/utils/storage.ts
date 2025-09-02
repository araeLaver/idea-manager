import { ideaService, memoService } from '../services/api';
import type { Idea } from '../types';
import type { DailyMemo } from '../../server/routes/memos';

// 기존 localStorage Memo 타입과의 호환성을 위한 변환 함수
const convertMemoForCompatibility = (memo: DailyMemo): any => ({
  id: memo.id,
  date: memo.date,
  content: memo.content,
  mood: memo.mood,
  weather: memo.weather,
  goals: memo.goals,
  achievements: memo.achievements,
  reflections: memo.reflections,
  tags: memo.tags,
  isFavorite: memo.isFavorite,
  createdAt: memo.createdAt,
  updatedAt: memo.updatedAt,
});

export const storage = {
  getIdeas: async (): Promise<Idea[]> => {
    try {
      return await ideaService.getAll();
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
      return [];
    }
  },

  saveIdeas: async (ideas: Idea[]): Promise<void> => {
    // 이 메서드는 API 기반에서는 사용하지 않음
    console.warn('saveIdeas method is deprecated with API backend');
  },

  getIdea: async (id: string): Promise<Idea | undefined> => {
    try {
      return await ideaService.getById(id);
    } catch (error) {
      console.error('Failed to fetch idea:', error);
      return undefined;
    }
  },

  addIdea: async (idea: Idea): Promise<void> => {
    try {
      await ideaService.create(idea);
    } catch (error) {
      console.error('Failed to add idea:', error);
      throw error;
    }
  },

  updateIdea: async (id: string, updatedIdea: Partial<Idea>): Promise<void> => {
    try {
      await ideaService.update(id, updatedIdea);
    } catch (error) {
      console.error('Failed to update idea:', error);
      throw error;
    }
  },

  deleteIdea: async (id: string): Promise<void> => {
    try {
      await ideaService.delete(id);
    } catch (error) {
      console.error('Failed to delete idea:', error);
      throw error;
    }
  },

  getMemos: async (): Promise<any[]> => {
    try {
      const memos = await memoService.getAll();
      return memos.map(convertMemoForCompatibility);
    } catch (error) {
      console.error('Failed to fetch memos:', error);
      return [];
    }
  },

  saveMemos: async (memos: any[]): Promise<void> => {
    // 이 메서드는 API 기반에서는 사용하지 않음
    console.warn('saveMemos method is deprecated with API backend');
  },

  getMemo: async (date: string): Promise<any | undefined> => {
    try {
      const memo = await memoService.getByDate(date);
      return memo ? convertMemoForCompatibility(memo) : undefined;
    } catch (error) {
      console.error('Failed to fetch memo:', error);
      return undefined;
    }
  },

  saveMemo: async (memo: any): Promise<void> => {
    try {
      const memoData = {
        date: memo.date,
        content: memo.content,
        mood: memo.mood,
        weather: memo.weather,
        goals: memo.goals || [],
        achievements: memo.achievements || [],
        reflections: memo.reflections,
        tags: memo.tags || [],
        isFavorite: memo.isFavorite || false,
      };
      await memoService.save(memoData);
    } catch (error) {
      console.error('Failed to save memo:', error);
      throw error;
    }
  },

  deleteMemo: async (id: string): Promise<void> => {
    try {
      await memoService.delete(id);
    } catch (error) {
      console.error('Failed to delete memo:', error);
      throw error;
    }
  }
};