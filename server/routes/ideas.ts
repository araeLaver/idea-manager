import { Router } from 'express';
import { pool } from '../index.js';
import type { Idea } from '../../src/types/index.js';

export const ideaRoutes = Router();

// 모든 아이디어 조회
ideaRoutes.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, title, description, category, tags, status, priority,
        target_market, potential_revenue, resources, timeline, notes,
        created_at, updated_at
      FROM idea_manager.ideas 
      ORDER BY created_at DESC
    `);
    
    const ideas: Idea[] = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      priority: row.priority,
      targetMarket: row.target_market,
      potentialRevenue: row.potential_revenue,
      resources: row.resources,
      timeline: row.timeline,
      notes: row.notes,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
    
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// 특정 아이디어 조회
ideaRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        id, title, description, category, tags, status, priority,
        target_market, potential_revenue, resources, timeline, notes,
        created_at, updated_at
      FROM idea_manager.ideas 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const row = result.rows[0];
    const idea: Idea = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      priority: row.priority,
      targetMarket: row.target_market,
      potentialRevenue: row.potential_revenue,
      resources: row.resources,
      timeline: row.timeline,
      notes: row.notes,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// 아이디어 생성
ideaRoutes.post('/', async (req, res) => {
  try {
    const { title, description, category, tags, status, priority, targetMarket, potentialRevenue, resources, timeline, notes } = req.body;
    
    const result = await pool.query(`
      INSERT INTO idea_manager.ideas 
      (title, description, category, tags, status, priority, target_market, potential_revenue, resources, timeline, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING 
        id, title, description, category, tags, status, priority,
        target_market, potential_revenue, resources, timeline, notes,
        created_at, updated_at
    `, [title, description, category, tags, status, priority, targetMarket, potentialRevenue, resources, timeline, notes]);
    
    const row = result.rows[0];
    const idea: Idea = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      priority: row.priority,
      targetMarket: row.target_market,
      potentialRevenue: row.potential_revenue,
      resources: row.resources,
      timeline: row.timeline,
      notes: row.notes,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.status(201).json(idea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// 아이디어 수정
ideaRoutes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, status, priority, targetMarket, potentialRevenue, resources, timeline, notes } = req.body;
    
    const result = await pool.query(`
      UPDATE idea_manager.ideas 
      SET title = $1, description = $2, category = $3, tags = $4, status = $5, 
          priority = $6, target_market = $7, potential_revenue = $8, 
          resources = $9, timeline = $10, notes = $11
      WHERE id = $12
      RETURNING 
        id, title, description, category, tags, status, priority,
        target_market, potential_revenue, resources, timeline, notes,
        created_at, updated_at
    `, [title, description, category, tags, status, priority, targetMarket, potentialRevenue, resources, timeline, notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const row = result.rows[0];
    const idea: Idea = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      priority: row.priority,
      targetMarket: row.target_market,
      potentialRevenue: row.potential_revenue,
      resources: row.resources,
      timeline: row.timeline,
      notes: row.notes,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
    
    res.json(idea);
  } catch (error) {
    console.error('Error updating idea:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

// 아이디어 삭제
ideaRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM idea_manager.ideas WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});