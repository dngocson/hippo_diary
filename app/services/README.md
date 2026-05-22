# Supabase Services Documentation

Tài liệu hướng dẫn sử dụng các services cho Hippo Diary.

## 📁 Danh sách Services

- **supabaseProfileService**: Quản lý user profiles
- **supabaseDiaryService**: Quản lý diaries
- **supabaseMoodService**: Quản lý moods
- **supabaseMemoryService**: Quản lý memories (kỷ niệm)
- **supabaseNoteService**: Quản lý notes (standalone hoặc thuộc memory)
- **supabaseCheckinService**: Quản lý checkins (địa điểm)
- **supabaseTagService**: Quản lý tags và memory_tags
- **supabaseMemoryImageService**: Quản lý images của memories

## 🚀 Cách sử dụng

### 1. Profile Service

```tsx
import {
  useCurrentProfile,
  useUpdateProfile,
} from "@/app/services/supabaseProfileService";

function ProfileScreen() {
  const { data: profile, isLoading } = useCurrentProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    await updateProfile.mutateAsync({
      username: "newhippo",
      avatar_url: "https://example.com/avatar.jpg",
    });
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Username: {profile?.username}</Text>
      <Button onPress={handleUpdate}>Update Profile</Button>
    </View>
  );
}
```

### 2. Diary Service

```tsx
import {
  useDiaries,
  useCreateDiary,
  useUpdateDiary,
} from "@/app/services/supabaseDiaryService";

function DiaryList() {
  const { data: diaries = [] } = useDiaries();
  const createDiary = useCreateDiary();

  const handleCreate = async () => {
    await createDiary.mutateAsync({
      title: "My Trip to Japan",
      description: "Summer vacation 2024",
      visibility: "private",
    });
  };

  return (
    <View>
      {diaries.map((diary) => (
        <Text key={diary.id}>{diary.title}</Text>
      ))}
      <Button onPress={handleCreate}>Create New Diary</Button>
    </View>
  );
}
```

### 3. Memory Service

```tsx
import {
  useMemoriesByDiary,
  useCreateMemory,
} from "@/app/services/supabaseMemoryService";

function MemoryList({ diaryId }: { diaryId: string }) {
  const { data: memories = [] } = useMemoriesByDiary(diaryId);
  const createMemory = useCreateMemory();

  const handleCreate = async () => {
    await createMemory.mutateAsync({
      diary_id: diaryId,
      title: "Tokyo Tower Visit",
      content: "Amazing experience!",
      mood_id: 1, // Happy
      start_date: "2024-07-01",
      end_date: "2024-07-01",
    });
  };

  return (
    <View>
      {memories.map((memory) => (
        <Text key={memory.id}>{memory.title}</Text>
      ))}
      <Button onPress={handleCreate}>Add Memory</Button>
    </View>
  );
}
```

### 4. Note Service

```tsx
import {
  useNotesByMemory,
  useStandaloneNotes,
  useCreateNote,
} from "@/app/services/supabaseNoteService";

// Notes thuộc một memory
function MemoryNotes({ memoryId }: { memoryId: string }) {
  const { data: notes = [] } = useNotesByMemory(memoryId);
  const createNote = useCreateNote();

  const handleCreate = async () => {
    await createNote.mutateAsync({
      memory_id: memoryId,
      title: "Don't forget",
      content: "Need to visit this place again!",
    });
  };

  return <View>{/* ... */}</View>;
}

// Standalone notes (không thuộc memory nào)
function QuickNotes() {
  const { data: notes = [] } = useStandaloneNotes();
  const createNote = useCreateNote();

  const handleCreate = async () => {
    await createNote.mutateAsync({
      memory_id: null, // null = standalone
      content: "Random thought of the day",
    });
  };

  return <View>{/* ... */}</View>;
}
```

### 5. Checkin Service

```tsx
import {
  useCheckinsByMemory,
  useCreateCheckin,
} from "@/app/services/supabaseCheckinService";

function LocationCheckins({ memoryId }: { memoryId: string }) {
  const { data: checkins = [] } = useCheckinsByMemory(memoryId);
  const createCheckin = useCreateCheckin();

  const handleCheckin = async () => {
    await createCheckin.mutateAsync({
      memory_id: memoryId,
      place_name: "Tokyo Tower",
      address: "4-2-8 Shibakoen, Minato City, Tokyo",
      latitude: 35.6586,
      longitude: 139.7454,
      checkin_time: new Date().toISOString(),
    });
  };

  return <View>{/* ... */}</View>;
}
```

### 6. Tag Service

```tsx
import {
  useTags,
  useMemoryTags,
  useSetMemoryTags,
  useGetOrCreateTag,
} from "@/app/services/supabaseTagService";

function TagManager({ memoryId }: { memoryId: string }) {
  const { data: allTags = [] } = useTags();
  const { data: memoryTags = [] } = useMemoryTags(memoryId);
  const setTags = useSetMemoryTags();
  const getOrCreateTag = useGetOrCreateTag();

  const handleAddTag = async () => {
    // Tạo tag mới hoặc lấy existing
    const tag = await getOrCreateTag.mutateAsync("travel");

    // Set tags cho memory
    const currentTagIds = memoryTags.map((t) => t.id);
    await setTags.mutateAsync({
      memoryId,
      tagIds: [...currentTagIds, tag.id],
    });
  };

  return <View>{/* ... */}</View>;
}
```

### 7. Memory Image Service

```tsx
import {
  useMemoryImages,
  useAddMemoryImage,
  useReorderMemoryImages,
} from "@/app/services/supabaseMemoryImageService";

function MemoryGallery({ memoryId }: { memoryId: string }) {
  const { data: images = [] } = useMemoryImages(memoryId);
  const addImage = useAddMemoryImage();
  const reorder = useReorderMemoryImages();

  const handleAddImage = async (imageUrl: string) => {
    await addImage.mutateAsync({
      memory_id: memoryId,
      image_url: imageUrl,
      // sort_order sẽ tự động set = max + 1
    });
  };

  const handleReorder = async (
    newOrder: Array<{ id: string; sort_order: number }>,
  ) => {
    await reorder.mutateAsync({ images: newOrder });
  };

  return (
    <View>
      {images.map((img) => (
        <Image key={img.id} source={{ uri: img.image_url }} />
      ))}
    </View>
  );
}
```

### 8. Mood Service

```tsx
import { useMoods, useMood } from "@/app/services/supabaseMoodService";

function MoodSelector() {
  const { data: moods = [] } = useMoods();

  return (
    <View>
      {moods.map((mood) => (
        <Button key={mood.id}>
          {mood.emoji} {mood.name}
        </Button>
      ))}
    </View>
  );
}
```

## 🔥 Features

### ✅ Type Safety

Tất cả services đều có TypeScript types đầy đủ.

### ✅ React Query Integration

- Automatic caching
- Optimistic updates
- Auto refetch on reconnect
- Error handling

### ✅ Query Key Management

Mỗi service có query keys được organize tốt:

```tsx
DIARY_QUERY_KEYS.diaries.all(); // ["diaries"]
DIARY_QUERY_KEYS.diaries.lists(); // ["diaries", "list"]
DIARY_QUERY_KEYS.diaries.detail(id); // ["diaries", "123"]
```

### ✅ RLS Security

Tất cả queries đều tuân theo Row Level Security policies từ database.

## 📊 Database Schema

Schema đầy đủ có trong file `database/schema.sql`.

### Relationships:

- `profiles` ← `diaries` (user có nhiều diaries)
- `diaries` ← `memories` (diary có nhiều memories)
- `memories` ← `memory_images` (memory có nhiều images)
- `memories` ↔ `tags` (many-to-many qua `memory_tags`)
- `memories` ← `notes` (optional)
- `memories` ← `checkins` (optional)
- `users` ← `notes` (standalone notes)
- `users` ← `checkins` (standalone checkins)

## 🛡️ Authentication

Tất cả services đều yêu cầu authentication. User ID được lấy từ:

```tsx
const {
  data: { user },
} = await supabase.auth.getUser();
```

## 🔄 Mutations với Invalidation

Khi mutation thành công, React Query sẽ tự động invalidate các queries liên quan:

```tsx
// Sau khi tạo diary mới
queryClient.invalidateQueries({
  queryKey: DIARY_QUERY_KEYS.diaries.lists(),
});

// Sau khi update memory
queryClient.invalidateQueries({
  queryKey: MEMORY_QUERY_KEYS.memories.byDiary(diaryId),
});
```

## 🎨 Best Practices

1. **Luôn enable hooks có điều kiện:**

```tsx
const { data } = useMemory(memoryId, { enabled: !!memoryId });
```

2. **Handle loading states:**

```tsx
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

3. **Use optimistic updates cho UX tốt hơn:**

```tsx
const mutation = useUpdateDiary({
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ["diaries"] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(["diaries"]);

    // Optimistically update
    queryClient.setQueryData(["diaries"], (old) => {
      return old?.map((d) => (d.id === newData.id ? newData : d));
    });

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(["diaries"], context?.previous);
  },
});
```

## 🔌 API Reference

Mỗi service cung cấp:

### API Functions (Pure Functions)

- `getXxx()` - Fetch data
- `createXxx()` - Create new record
- `updateXxx()` - Update record
- `deleteXxx()` - Delete record

### React Hooks

- `useXxx()` - Query hook
- `useCreateXxx()` - Create mutation hook
- `useUpdateXxx()` - Update mutation hook
- `useDeleteXxx()` - Delete mutation hook

## 📝 Environment Setup

Đảm bảo `.env` có:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

## 🐛 Debugging

Enable React Query DevTools (optional):

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

## 📚 More Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Database Schema](../database/schema.sql)
