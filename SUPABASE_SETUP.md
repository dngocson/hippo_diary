# Supabase Setup Guide

## 🚀 Quick Start

### 1. Tạo Supabase Project

1. Đăng ký/Đăng nhập tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Chọn region gần bạn nhất (Singapore cho VN)
4. Đợi project được tạo (~2 phút)

### 2. Lấy API Keys

1. Vào **Settings** → **API**
2. Copy:
   - **Project URL** (ví dụ: `https://xxxxx.supabase.co`)
   - **anon public** key (key dài, bắt đầu với `eyJ...`)

3. Thêm vào file `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Setup Database Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy toàn bộ nội dung file [`supabase_schema.sql`](./supabase_schema.sql)
3. Paste vào SQL Editor
4. Click **Run** để tạo tables và policies

### 4. Verify Setup

Kiểm tra trong **Table Editor**:

- ✅ Table `diary_entries` đã được tạo
- ✅ RLS (Row Level Security) đã enable
- ✅ Policies đã được tạo

## 📁 File Structure

```
app/
├── libs/
│   ├── supabase.ts              # Supabase client config
│   └── supabaseHelpers.ts       # Auth & utility helpers
└── services/
    └── supabaseDiaryService.ts  # Diary CRUD với React Query hooks

supabase_schema.sql               # Database schema
SUPABASE_SETUP.md                # Hướng dẫn này
```

## 🔧 Usage

### Authentication

```typescript
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChange,
} from "@/app/libs/supabaseHelpers";

// Đăng ký
const { user } = await signUp("email@example.com", "password123");

// Đăng nhập
const { user, session } = await signIn("email@example.com", "password123");

// Đăng xuất
await signOut();

// Lấy user hiện tại
const user = await getCurrentUser();

// Lắng nghe auth state changes
const unsubscribe = onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Session:", session);
});

// Cleanup
unsubscribe();
```

### Diary CRUD Operations

```typescript
import {
  useSupabaseDiaryEntries,
  useSupabaseDiaryEntryByDate,
  useSupabaseCreateDiaryEntry,
  useSupabaseUpdateDiaryEntry,
  useSupabaseDeleteDiaryEntry,
} from "@/app/services/supabaseDiaryService";

// Component
function DiaryScreen() {
  // Lấy tất cả entries
  const { data: entries, isLoading } = useSupabaseDiaryEntries();

  // Lấy entry theo ngày
  const { data: todayEntry } = useSupabaseDiaryEntryByDate("2026-05-22");

  // Mutations
  const createMutation = useSupabaseCreateDiaryEntry();
  const updateMutation = useSupabaseUpdateDiaryEntry();
  const deleteMutation = useSupabaseDeleteDiaryEntry();

  // Create
  const handleCreate = () => {
    createMutation.mutate({
      date: "2026-05-22",
      content: "Nội dung nhật ký",
      activities: "Hoạt động",
    });
  };

  // Update
  const handleUpdate = (id: string) => {
    updateMutation.mutate({
      id,
      content: "Nội dung mới",
    });
  };

  // Delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <View>
      {entries?.map((entry) => (
        <Text key={entry.id}>{entry.content}</Text>
      ))}
    </View>
  );
}
```

### Direct Supabase Queries

Nếu cần query trực tiếp không qua hooks:

```typescript
import { supabase } from "@/app/libs/supabase";

// Select
const { data, error } = await supabase
  .from("diary_entries")
  .select("*")
  .eq("date", "2026-05-22")
  .single();

// Insert
const { data, error } = await supabase
  .from("diary_entries")
  .insert([{ date: "2026-05-22", content: "..." }])
  .select();

// Update
const { data, error } = await supabase
  .from("diary_entries")
  .update({ content: "..." })
  .eq("id", entryId)
  .select();

// Delete
const { error } = await supabase
  .from("diary_entries")
  .delete()
  .eq("id", entryId);
```

## 🔐 Security (Row Level Security)

Database đã được cấu hình với RLS:

- ✅ User chỉ có thể xem/tạo/sửa/xóa entries của chính mình
- ✅ Không thể truy cập entries của user khác
- ✅ Tự động lấy `user_id` từ auth token

**Lưu ý**: Phải đăng nhập trước khi thực hiện CRUD operations!

## 🔄 Realtime (Optional)

Enable realtime để tự động update UI khi data thay đổi:

### 1. Enable trong Dashboard

1. Vào **Database** → **Replication**
2. Enable realtime cho table `diary_entries`

### 2. Subscribe to changes

```typescript
import { subscribeToTable } from "@/app/libs/supabaseHelpers";

// Subscribe
const unsubscribe = subscribeToTable("diary_entries", (payload) => {
  console.log("Change:", payload.eventType);
  console.log("New:", payload.new);
  console.log("Old:", payload.old);

  // Invalidate queries để refetch data
  queryClient.invalidateQueries({ queryKey: ["diary"] });
});

// Cleanup
unsubscribe();
```

## 📦 Storage (Optional - cho ảnh đính kèm)

Nếu muốn cho phép user upload ảnh:

### 1. Tạo Bucket

1. Vào **Storage** trong Dashboard
2. Tạo bucket mới: `diary-images`
3. Set **Public**: No (private)

### 2. Enable Policies

Uncomment phần Storage trong `supabase_schema.sql` và run lại.

### 3. Upload Files

```typescript
import { uploadFile, getPublicUrl } from "@/app/libs/supabaseHelpers";

// Upload
const { path } = await uploadFile(
  "diary-images",
  `${userId}/2026-05-22.jpg`,
  imageFile,
  {
    contentType: "image/jpeg",
    upsert: true,
  },
);

// Get URL
const url = getPublicUrl("diary-images", path);
```

## 🧪 Testing

### Test Authentication

```bash
# Trong app, đăng ký user test
email: test@example.com
password: test123456
```

### Test Database

Sau khi đăng nhập, thử create diary entry:

```typescript
const { data } = await supabase
  .from("diary_entries")
  .insert([
    {
      date: "2026-05-22",
      content: "Test entry",
      activities: "Testing",
    },
  ])
  .select();

console.log("Created:", data);
```

## 🔍 Debugging

### Check Auth Status

```typescript
const session = await supabase.auth.getSession();
console.log("Session:", session);
```

### Check RLS Policies

Trong SQL Editor:

```sql
-- Kiểm tra policies
SELECT * FROM pg_policies WHERE tablename = 'diary_entries';

-- Test query (phải đăng nhập trước)
SELECT * FROM diary_entries;
```

### Common Errors

**❌ "new row violates row-level security policy"**

- Chưa đăng nhập
- `user_id` không khớp với auth.uid()

**❌ "JWT expired"**

- Session hết hạn, cần refresh hoặc đăng nhập lại

**❌ "relation does not exist"**

- Chưa chạy schema SQL
- Sai tên table

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

## 💡 Tips

1. **Development vs Production**: Tạo 2 projects riêng cho dev và prod
2. **Backup**: Enable automated backups trong Settings
3. **Monitoring**: Theo dõi usage trong Dashboard
4. **Free Tier Limits**:
   - 500MB database
   - 1GB file storage
   - 2GB bandwidth/tháng
   - 50,000 monthly active users

## 🚨 Security Best Practices

1. ✅ Không commit `.env` vào Git
2. ✅ Dùng anon key (public), không dùng service_role key ở client
3. ✅ Enable RLS cho tất cả tables
4. ✅ Test policies kỹ trước khi deploy
5. ✅ Sử dụng HTTPS trong production
