import type { Idea } from '../types';
import type { DailyMemo } from '../../server/routes/memos';

const API_BASE_URL = 'http://localhost:3001/api';

// Ideas API
export const ideaService = {
  async getAll(): Promise<Idea[]> {
    const response = await fetch(`${API_BASE_URL}/ideas`);
    if (!response.ok) throw new Error('Failed to fetch ideas');
    return response.json();
  },

  async getById(id: string): Promise<Idea> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`);
    if (!response.ok) throw new Error('Failed to fetch idea');
    return response.json();
  },

  async create(idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>): Promise<Idea> {
    const response = await fetch(`${API_BASE_URL}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });
    if (!response.ok) throw new Error('Failed to create idea');
    return response.json();
  },

  async update(id: string, idea: Partial<Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Idea> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });
    if (!response.ok) throw new Error('Failed to update idea');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete idea');
  },
};

// Memos API
export const memoService = {
  async getAll(): Promise<DailyMemo[]> {
    const response = await fetch(`${API_BASE_URL}/memos`);
    if (!response.ok) throw new Error('Failed to fetch memos');
    return response.json();
  },

  async getByDate(date: string): Promise<DailyMemo | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/memos/${date}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch memo');
      return response.json();
    } catch (error) {
      return null;
    }
  },

  async save(memo: Omit<DailyMemo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMemo> {
    const response = await fetch(`${API_BASE_URL}/memos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memo),
    });
    if (!response.ok) throw new Error('Failed to save memo');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete memo');
  },

  async toggleFavorite(id: string): Promise<DailyMemo> {
    const response = await fetch(`${API_BASE_URL}/memos/${id}/favorite`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  },
};