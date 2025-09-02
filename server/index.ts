import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { ideaRoutes } from './routes/ideas.js';
import { memoRoutes } from './routes/memos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL 연결
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/ideas', ideaRoutes);
app.use('/api/memos', memoRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 데이터베이스 연결 테스트
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});