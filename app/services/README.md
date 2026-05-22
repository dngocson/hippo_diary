# Axios & React Query Configuration

## Setup hoàn tất! 🎉

Dự án đã được cấu hình với Axios và React Query (TanStack Query) để quản lý API calls hiệu quả.

## Cấu trúc files

```
app/
├── config/
│   └── index.ts          # App configuration với type safety
├── libs/
│   ├── axios.ts          # Axios instance với interceptors
│   └── queryClient.ts    # React Query client config
├── services/
│   ├── types.ts          # Types và query keys
│   └── diaryService.ts   # API service với React Query hooks
└── _layout.tsx           # Root layout với QueryClientProvider
.env                       # Environment variables (không commit)
.env.example               # Environment template
ENV_SETUP.md               # Hướng dẫn chi tiết setup env
```

## Cấu hình môi trường

### 1. Setup .env file

```bash
# Copy template
cp .env.example .env
```

### 2. Cập nhật .env

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Supabase (optional)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Config
EXPO_PUBLIC_APP_NAME=Hippo Diary
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENABLE_DEBUG=true
```

📖 **Xem [ENV_SETUP.md](../ENV_SETUP.md) để biết chi tiết về cấu hình môi trường**

### 3. Sử dụng Config

```typescript
import config from "@/app/config";

// Type-safe access
const apiUrl = config.api.baseUrl;
const appName = config.app.name;
const debugMode = config.features.debug;
```

#### Lấy danh sách diary entries

```tsx
import { useDiaryEntries } from "@/app/services/diaryService";

function DiaryList() {
  const { data, isLoading, error } = useDiaryEntries();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data?.map((entry) => (
        <Text key={entry.id}>{entry.content}</Text>
      ))}
    </View>
  );
}
```

#### Lấy diary entry theo ngày

```tsx
import { useDiaryEntryByDate } from "@/app/services/diaryService";

function DayDetail() {
  const { date } = useLocalSearchParams();
  const { data, isLoading } = useDiaryEntryByDate(date);

  return <View>{/* Render diary entry */}</View>;
}
```

#### Tạo diary entry mới

```tsx
import { useCreateDiaryEntry } from "@/app/services/diaryService";

function CreateDiary() {
  const createMutation = useCreateDiaryEntry();

  const handleSubmit = () => {
    createMutation.mutate(
      {
        date: "2026-05-22",
        content: "Nội dung nhật ký",
        activities: "Hoạt động hôm nay",
      },
      {
        onSuccess: (data) => {
          console.log("Created:", data);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      },
    );
  };

  return (
    <Button onPress={handleSubmit} disabled={createMutation.isPending}>
      {createMutation.isPending ? "Saving..." : "Save"}
    </Button>
  );
}
```

#### Cập nhật diary entry

```tsx
import { useUpdateDiaryEntry } from "@/app/services/diaryService";

function EditDiary() {
  const updateMutation = useUpdateDiaryEntry();

  const handleUpdate = () => {
    updateMutation.mutate({
      id: "entry-id",
      content: "Nội dung mới",
      activities: "Hoạt động mới",
    });
  };

  return <Button onPress={handleUpdate}>Update</Button>;
}
```

#### Xóa diary entry

```tsx
import { useDeleteDiaryEntry } from "@/app/services/diaryService";

function DeleteDiary() {
  const deleteMutation = useDeleteDiaryEntry();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        console.log("Deleted successfully");
      },
    });
  };

  return <Button onPress={() => handleDelete("entry-id")}>Delete</Button>;
}
```

### 3. Axios Interceptors

Axios đã được cấu hình với:

- **Request Interceptor**: Tự động thêm token vào header (cần uncomment code)
- **Response Interceptor**: Xử lý lỗi chung (401, network errors, etc.)
- **Timeout**: 10 giây
- **Base URL**: Từ environment variable

### 4. React Query Features

- ✅ Automatic caching (5 phút stale time)
- ✅ Auto retry (2 lần cho queries, 1 lần cho mutations)
- ✅ Garbage collection (10 phút)
- ✅ Optimistic updates support
- ✅ Query invalidation

### 5. Thêm API service mới

Để thêm service mới (ví dụ: User service):

1. Thêm types vào `services/types.ts`:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export const QUERY_KEYS = {
  // ... existing keys
  user: {
    all: ["user"] as const,
    detail: (id: string) => [...QUERY_KEYS.user.all, id] as const,
  },
};
```

2. Tạo `services/userService.ts`:

```ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/libs/axios";
import { User, QUERY_KEYS } from "./types";

export const getUser = async (id: string): Promise<User> => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data.data;
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.user.detail(id),
    queryFn: () => getUser(id),
  });
};
```

## Best Practices

1. **Error Handling**: Luôn xử lý errors trong component
2. **Loading States**: Hiển thị loading indicator khi `isLoading`
3. **Query Keys**: Sử dụng structured query keys từ `QUERY_KEYS`
4. **Mutations**: Sử dụng callbacks (`onSuccess`, `onError`) để xử lý kết quả
5. **Invalidation**: Invalidate queries sau mutation để cập nhật UI

## Debug

Để debug React Query, có thể thêm React Query Devtools (chỉ dành cho web):

```bash
npm install @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Thêm vào component
<ReactQueryDevtools initialIsOpen={false} />;
```
