-- Database Schema for Hippo Diary
-- Generated from Supabase project

-- ==================== PROFILES ====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== DIARIES ====================
CREATE TABLE diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'friends', 'public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== MOODS ====================
CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT,
  color TEXT
);

-- ==================== MEMORIES ====================
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  mood_id INTEGER REFERENCES moods(id),
  title TEXT NOT NULL,
  content TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== NOTES ====================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== CHECKINS ====================
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  place_name TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  checkin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== MEMORY_IMAGES ====================
CREATE TABLE memory_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== TAGS ====================
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- ==================== MEMORY_TAGS (Junction Table) ====================
CREATE TABLE memory_tags (
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (memory_id, tag_id)
);

-- ==================== INDEXES ====================
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_memories_diary_id ON memories(diary_id);
CREATE INDEX idx_memories_mood_id ON memories(mood_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_memory_id ON notes(memory_id);
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_memory_id ON checkins(memory_id);
CREATE INDEX idx_memory_images_memory_id ON memory_images(memory_id);
CREATE INDEX idx_memory_tags_memory_id ON memory_tags(memory_id);
CREATE INDEX idx_memory_tags_tag_id ON memory_tags(tag_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Diaries policies
CREATE POLICY "Users can view own diaries" ON diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diaries" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diaries" ON diaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diaries" ON diaries
  FOR DELETE USING (auth.uid() = user_id);

-- Memories policies
CREATE POLICY "Users can view own memories" ON memories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM diaries
      WHERE diaries.id = memories.diary_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create memories in own diaries" ON memories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM diaries
      WHERE diaries.id = memories.diary_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own memories" ON memories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM diaries
      WHERE diaries.id = memories.diary_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own memories" ON memories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM diaries
      WHERE diaries.id = memories.diary_id
      AND diaries.user_id = auth.uid()
    )
  );

-- Notes policies
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Checkins policies
CREATE POLICY "Users can view own checkins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own checkins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins" ON checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checkins" ON checkins
  FOR DELETE USING (auth.uid() = user_id);

-- Memory images policies
CREATE POLICY "Users can view images of own memories" ON memory_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_images.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add images to own memories" ON memory_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_images.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from own memories" ON memory_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_images.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own memory images" ON memory_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_images.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

-- Tags are public (read-only for users)
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- Memory tags policies
CREATE POLICY "Users can view tags of own memories" ON memory_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_tags.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add tags to own memories" ON memory_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_tags.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove tags from own memories" ON memory_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN diaries ON diaries.id = memories.diary_id
      WHERE memories.id = memory_tags.memory_id
      AND diaries.user_id = auth.uid()
    )
  );

-- ==================== TRIGGERS ====================

-- Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diaries_updated_at
  BEFORE UPDATE ON diaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at
  BEFORE UPDATE ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==================== SEED DATA ====================

-- Insert default moods
INSERT INTO moods (name, emoji, color) VALUES
  ('Happy', '😊', '#FFD700'),
  ('Sad', '😢', '#4169E1'),
  ('Excited', '🤩', '#FF6347'),
  ('Calm', '😌', '#87CEEB'),
  ('Angry', '😠', '#DC143C'),
  ('Anxious', '😰', '#9370DB'),
  ('Grateful', '🙏', '#32CD32'),
  ('Tired', '😴', '#708090')
ON CONFLICT (name) DO NOTHING;
