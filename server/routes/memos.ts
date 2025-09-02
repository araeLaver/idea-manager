import { Router } from 'express';
import { pool } from '../index.js';

export const memoRoutes = Router();

export interface DailyMemo {
  id: string;
  date: string;
  content: string;
  mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  weather?: string;
  goals?: string[];
  achievements?: string[];
  reflections?: string;
  tags?: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// 모든 메모 조회
memoRoutes.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, date, content, mood, weather, goals, achievements, 
        reflections, tags, is_favorite, created_at, updated_at
      FROM idea_manager.daily_memos 
      ORDER BY date DESC
    `);
    
    const memos: DailyMemo[] = result.rows.map(row => ({
      id: row.id,
      date: row.date.toISOString().split('T')[0],
      content: row.content,
      mood: row.mood,
      weather: row.weather,
      goals: row.goals || [],
      achievements: row.achievements || [],
      reflections: row.reflections,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
    
    res.json(memos);
  } catch (error) {
    console.error('Error fetching memos:', error);
    res.status(500).json({ error: 'Failed to fetch memos' });
  }
});

// 특정 날짜 메모 조회
memoRoutes.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await pool.query(`
      SELECT 
        id, date, content, mood, weather, goals, achievements, 
        reflections, tags, is_favorite, created_at, updated_at
      FROM idea_manager.daily_memos 
      WHERE date = $1
    `, [date]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    const row = result.rows[0];
    const memo: DailyMemo = {
      id: row.id,
      date: row.date.toISOString().split('T')[0],
      content: row.content,
      mood: row.mood,
      weather: row.weather,
      goals: row.goals || [],
      achievements: row.achievements || [],
      reflections: row.reflections,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.json(memo);
  } catch (error) {
    console.error('Error fetching memo:', error);
    res.status(500).json({ error: 'Failed to fetch memo' });
  }
});

// 메모 생성 또는 업데이트
memoRoutes.post('/', async (req, res) => {
  try {
    const { date, content, mood, weather, goals, achievements, reflections, tags, isFavorite } = req.body;
    
    const result = await pool.query(`
      INSERT INTO idea_manager.daily_memos 
      (date, content, mood, weather, goals, achievements, reflections, tags, is_favorite)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (date) DO UPDATE SET
        content = EXCLUDED.content,
        mood = EXCLUDED.mood,
        weather = EXCLUDED.weather,
        goals = EXCLUDED.goals,
        achievements = EXCLUDED.achievements,
        reflections = EXCLUDED.reflections,
        tags = EXCLUDED.tags,
        is_favorite = EXCLUDED.is_favorite
      RETURNING 
        id, date, content, mood, weather, goals, achievements, 
        reflections, tags, is_favorite, created_at, updated_at
    `, [date, content, mood, weather, goals, achievements, reflections, tags, isFavorite]);
    
    const row = result.rows[0];
    const memo: DailyMemo = {
      id: row.id,
      date: row.date.toISOString().split('T')[0],
      content: row.content,
      mood: row.mood,
      weather: row.weather,
      goals: row.goals || [],
      achievements: row.achievements || [],
      reflections: row.reflections,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.status(201).json(memo);
  } catch (error) {
    console.error('Error creating/updating memo:', error);
    res.status(500).json({ error: 'Failed to create/update memo' });
  }
});

// 메모 삭제
memoRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM idea_manager.daily_memos WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting memo:', error);
    res.status(500).json({ error: 'Failed to delete memo' });
  }
});

// 즐겨찾기 토글
memoRoutes.patch('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE idea_manager.daily_memos 
      SET is_favorite = NOT is_favorite
      WHERE id = $1
      RETURNING 
        id, date, content, mood, weather, goals, achievements, 
        reflections, tags, is_favorite, created_at, updated_at
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    const row = result.rows[0];
    const memo: DailyMemo = {
      id: row.id,
      date: row.date.toISOString().split('T')[0],
      content: row.content,
      mood: row.mood,
      weather: row.weather,
      goals: row.goals || [],
      achievements: row.achievements || [],
      reflections: row.reflections,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.json(memo);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});