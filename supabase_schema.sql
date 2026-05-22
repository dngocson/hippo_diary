-- ==========================================
-- Supabase Database Schema for Hippo Diary
-- ==========================================

-- Enable UUID extension (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Table: diary_entries
-- ==========================================

CREATE TABLE IF NOT EXISTS public.diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    activities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Mỗi user chỉ có 1 entry mỗi ngày
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- ==========================================
-- Indexes
-- ==========================================

-- Index cho user_id để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id 
    ON public.diary_entries(user_id);

-- Index cho date để sắp xếp và filter nhanh
CREATE INDEX IF NOT EXISTS idx_diary_entries_date 
    ON public.diary_entries(date DESC);

-- Composite index cho user_id và date
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_date 
    ON public.diary_entries(user_id, date DESC);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể xem entries của mình
CREATE POLICY "Users can view their own diary entries"
    ON public.diary_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: User chỉ có thể tạo entries cho mình
CREATE POLICY "Users can create their own diary entries"
    ON public.diary_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: User chỉ có thể update entries của mình
CREATE POLICY "Users can update their own diary entries"
    ON public.diary_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: User chỉ có thể xóa entries của mình
CREATE POLICY "Users can delete their own diary entries"
    ON public.diary_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- Triggers
-- ==========================================

-- Function: Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at khi row được update
DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON public.diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
    BEFORE UPDATE ON public.diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Sample Data (Optional - for testing)
-- ==========================================

-- Uncomment để thêm sample data
/*
INSERT INTO public.diary_entries (user_id, date, content, activities)
VALUES 
    (auth.uid(), CURRENT_DATE, 'Hôm nay là một ngày tuyệt vời!', 'Đọc sách, Tập thể dục'),
    (auth.uid(), CURRENT_DATE - INTERVAL '1 day', 'Ngày hôm qua khá bận rộn', 'Họp nhóm, Làm bài tập');
*/

-- ==========================================
-- Realtime (Optional)
-- ==========================================

-- Enable realtime cho table diary_entries
-- Đi đến Supabase Dashboard → Database → Replication
-- Và enable realtime cho table "diary_entries"

-- ==========================================
-- Storage Buckets (Optional - cho ảnh đính kèm)
-- ==========================================

-- Tạo bucket cho diary images
-- Chạy từ SQL Editor hoặc tạo trong Dashboard → Storage

/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-images', 'diary-images', false);

-- Policy: User chỉ có thể upload vào folder của mình
CREATE POLICY "Users can upload their own images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'diary-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Policy: User chỉ có thể xem ảnh của mình
CREATE POLICY "Users can view their own images"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'diary-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Policy: User chỉ có thể xóa ảnh của mình
CREATE POLICY "Users can delete their own images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'diary-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
*/

-- ==========================================
-- Useful Queries
-- ==========================================

-- Lấy tất cả entries của user hiện tại
-- SELECT * FROM diary_entries WHERE user_id = auth.uid() ORDER BY date DESC;

-- Lấy entries theo tháng
-- SELECT * FROM diary_entries 
-- WHERE user_id = auth.uid() 
--   AND date >= '2026-05-01' 
--   AND date <= '2026-05-31'
-- ORDER BY date ASC;

-- Đếm số entries của user
-- SELECT COUNT(*) FROM diary_entries WHERE user_id = auth.uid();

-- Lấy entry mới nhất
-- SELECT * FROM diary_entries WHERE user_id = auth.uid() ORDER BY date DESC LIMIT 1;
