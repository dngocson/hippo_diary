# Memory Service - Simple Version

## Schema

```sql
CREATE TABLE memories (
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
```

## Quan hệ

- **memories** → **diaries**: Một memory thuộc về một diary entry
- **memories** → **moods**: Một memory có thể có mood (optional)
- RLS: User access thông qua `diary_id` (kiểm tra diary có thuộc user không)

## Files

- [supabaseMemoryService.ts](./app/services/supabaseMemoryService.ts) - Service với React Query hooks
- [supabase_memories_schema.sql](./supabase_memories_schema.sql) - Database schema
- [EXAMPLE_MEMORY_SIMPLE.tsx](./app/services/EXAMPLE_MEMORY_SIMPLE.tsx) - Usage examples

## Setup

1. Chạy SQL trong Supabase SQL Editor:

   ```bash
   # Copy nội dung từ supabase_memories_schema.sql
   # Paste vào SQL Editor và Run
   ```

2. Đảm bảo đã có table `diaries` trước (memory references diaries)

## Usage

### Get all memories

```typescript
import { useMemories } from "@/app/services/supabaseMemoryService";

const { data: memories, isLoading } = useMemories();
```

### Get memories by diary

```typescript
import { useMemoriesByDiary } from "@/app/services/supabaseMemoryService";

const { data: memories } = useMemoriesByDiary(diaryId);
```

### Create memory

```typescript
import { useCreateMemory } from "@/app/services/supabaseMemoryService";

const createMutation = useCreateMemory();

createMutation.mutate({
  diary_id: "diary-id",
  title: "Kỷ niệm đáng nhớ",
  content: "Nội dung...",
  start_date: "2026-05-22T09:00:00Z",
  end_date: "2026-05-24T18:00:00Z",
  mood_id: 1, // optional
});
```

### Update memory

```typescript
import { useUpdateMemory } from "@/app/services/supabaseMemoryService";

const updateMutation = useUpdateMemory();

updateMutation.mutate({
  id: "memory-id",
  title: "Tiêu đề mới",
  content: "Nội dung mới",
});
```

### Delete memory

```typescript
import { useDeleteMemory } from "@/app/services/supabaseMemoryService";

const deleteMutation = useDeleteMemory();

deleteMutation.mutate("memory-id");
```

### Search memories

```typescript
import { useSearchMemories } from "@/app/services/supabaseMemoryService";

const { data: results } = useSearchMemories("keyword");
```

## Data Structure

```typescript
interface MemoryEntry {
  id: string;
  diary_id: string;
  mood_id?: number | null;
  title: string;
  content?: string | null;
  start_date?: string | null; // TIMESTAMPTZ
  end_date?: string | null; // TIMESTAMPTZ
  created_at: string;
  updated_at: string;
}
```

## Examples

Xem file [EXAMPLE_MEMORY_SIMPLE.tsx](./app/services/EXAMPLE_MEMORY_SIMPLE.tsx) cho:

1. ✅ Danh sách memories
2. ✅ Memories theo diary
3. ✅ Search memories
4. ✅ Create memory form
5. ✅ Edit & delete memory

## Notes

- Memory được liên kết với diary, không độc lập
- User access được kiểm tra qua RLS của diaries table
- `start_date` và `end_date` dùng cho memories kéo dài nhiều ngày (vd: chuyến đi, sự kiện)
- `mood_id` optional - có thể link đến moods table nếu cần
