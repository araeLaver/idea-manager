-- 아이디어 관리 서비스 전용 스키마
CREATE SCHEMA IF NOT EXISTS idea_manager;

-- 스키마 사용 설정
SET search_path TO idea_manager;

-- 아이디어 테이블
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'in-progress', 'completed', 'on-hold')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    target_market TEXT,
    potential_revenue TEXT,
    resources TEXT,
    timeline TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 일일 메모 테이블 (강화된 버전)
CREATE TABLE IF NOT EXISTS daily_memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    content TEXT NOT NULL,
    mood VARCHAR(20) CHECK (mood IN ('excellent', 'good', 'neutral', 'bad', 'terrible')),
    weather VARCHAR(20),
    goals TEXT[],
    achievements TEXT[],
    reflections TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 메모 첨부파일 테이블 (향후 확장용)
CREATE TABLE IF NOT EXISTS memo_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memo_id UUID REFERENCES daily_memos(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 아이디어 댓글/노트 테이블
CREATE TABLE IF NOT EXISTS idea_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    note_type VARCHAR(20) DEFAULT 'note' CHECK (note_type IN ('note', 'milestone', 'issue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_priority ON ideas(priority);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_memos_date ON daily_memos(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_memos_mood ON daily_memos(mood);
CREATE INDEX IF NOT EXISTS idx_daily_memos_is_favorite ON daily_memos(is_favorite);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거
CREATE TRIGGER update_ideas_updated_at 
    BEFORE UPDATE ON ideas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_memos_updated_at 
    BEFORE UPDATE ON daily_memos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_idea_notes_updated_at 
    BEFORE UPDATE ON idea_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();