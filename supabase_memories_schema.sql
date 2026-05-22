-- ==========================================
-- Supabase Schema for Memories Table
-- ==========================================

-- ==========================================
-- Table: memories
-- ==========================================

CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    mood_id BIGINT REFERENCES moods(id),
    title TEXT NOT NULL,
    content TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Indexes
-- ==========================================

-- Index cho diary_id để query nhanh
CREATE INDEX IF NOT EXISTS idx_memories_diary_id 
    ON public.memories(diary_id);

-- Index cho mood_id
CREATE INDEX IF NOT EXISTS idx_memories_mood_id 
    ON public.memories(mood_id);

-- Index cho created_at để sort
CREATE INDEX IF NOT EXISTS idx_memories_created_at 
    ON public.memories(created_at DESC);

-- GIN index cho full-text search trên title và content
CREATE INDEX IF NOT EXISTS idx_memories_search 
    ON public.memories USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể xem memories của diary của mình
CREATE POLICY "Users can view their own memories"
    ON public.memories
    FOR SELECT
    USING (
        diary_id IN (
            SELECT id FROM diaries WHERE user_id = auth.uid()
        )
    );

-- Policy: User chỉ có thể tạo memories cho diary của mình
CREATE POLICY "Users can create memories for their diaries"
    ON public.memories
    FOR INSERT
    WITH CHECK (
        diary_id IN (
            SELECT id FROM diaries WHERE user_id = auth.uid()
        )
    );

-- Policy: User chỉ có thể update memories của diary của mình
CREATE POLICY "Users can update their own memories"
    ON public.memories
    FOR UPDATE
    USING (
        diary_id IN (
            SELECT id FROM diaries WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        diary_id IN (
            SELECT id FROM diaries WHERE user_id = auth.uid()
        )
    );

-- Policy: User chỉ có thể xóa memories của diary của mình
CREATE POLICY "Users can delete their own memories"
    ON public.memories
    FOR DELETE
    USING (
        diary_id IN (
            SELECT id FROM diaries WHERE user_id = auth.uid()
        )
    );

-- ==========================================
-- Triggers
-- ==========================================

-- Function: Auto update updated_at
CREATE OR REPLACE FUNCTION update_memories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at khi row được update
DROP TRIGGER IF EXISTS update_memories_updated_at ON public.memories;
CREATE TRIGGER update_memories_updated_at
    BEFORE UPDATE ON public.memories
    FOR EACH ROW
    EXECUTE FUNCTION update_memories_updated_at();

-- ==========================================
-- Sample Data (Optional - for testing)
-- ==========================================

/*
-- Uncomment để thêm sample data
-- Lưu ý: Cần có diary_id hợp lệ trước
INSERT INTO public.memories (diary_id, title, content, start_date, end_date)
VALUES 
    (
        'your-diary-id-here',
        'Kỷ niệm đáng nhớ',
        'Nội dung kỷ niệm...',
        '2026-05-01 09:00:00+00',
        '2026-05-03 18:00:00+00'
    );
*/

-- ==========================================
-- Useful Queries Examples
-- ==========================================

-- Lấy tất cả memories
-- SELECT * FROM memories ORDER BY created_at DESC;

-- Lấy memories theo diary
-- SELECT * FROM memories WHERE diary_id = 'diary-id';

-- Search memories
-- SELECT * FROM memories 
-- WHERE title ILIKE '%keyword%' OR content ILIKE '%keyword%';

-- Lấy memories với mood
-- SELECT m.*, mo.name as mood_name
-- FROM memories m
-- LEFT JOIN moods mo ON m.mood_id = mo.id;

-- Đếm memories theo diary
-- SELECT diary_id, COUNT(*) as memory_count
-- FROM memories
-- GROUP BY diary_id;
