# Environment Configuration Guide

## Quick Setup

1. **Copy file .env.example thành .env**:

   ```bash
   cp .env.example .env
   ```

2. **Cập nhật các giá trị trong .env**

## Environment Variables

### 🔌 EXPO_PUBLIC_API_URL

URL của API backend.

**Các giá trị phổ biến:**

- **Local Development**:

  ```env
  EXPO_PUBLIC_API_URL=http://localhost:3000/api
  ```

- **Testing trên thiết bị thật** (cần thay IP máy của bạn):

  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
  ```

  > 💡 Cách lấy IP máy:
  >
  > - Windows: `ipconfig` trong Command Prompt
  > - Mac/Linux: `ifconfig` trong Terminal
  > - Tìm địa chỉ IPv4 của máy (thường dạng 192.168.x.x)

- **Production**:
  ```env
  EXPO_PUBLIC_API_URL=https://api.yourdomain.com
  ```

### 🗄️ Supabase Configuration

Nếu sử dụng Supabase làm backend:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Lấy từ: Supabase Dashboard → Settings → API

### ⚙️ App Configuration

```env
EXPO_PUBLIC_APP_NAME=Hippo Diary
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_DEBUG=true
```

## Sử dụng trong code

Environment variables với prefix `EXPO_PUBLIC_` có thể truy cập trực tiếp:

```typescript
// Cách 1: Trực tiếp
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Cách 2: Trong axios config
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
```

## Lưu ý quan trọng

### ⚠️ Security

- **KHÔNG commit file .env** vào Git
- File .env đã được thêm vào .gitignore
- Chỉ commit .env.example (không chứa giá trị thật)
- Không lưu API keys, secrets vào EXPO*PUBLIC* variables (sẽ bị expose)

### 🔄 Reload sau khi thay đổi

Sau khi sửa .env, cần restart Expo:

```bash
# Stop server (Ctrl+C)
# Clear cache và restart
npx expo start -c
```

### 📱 Testing trên thiết bị

Khi test trên điện thoại/máy tính bảng thật:

1. Đảm bảo thiết bị và máy dev cùng mạng WiFi
2. Sử dụng IP của máy (không dùng localhost)
3. Nếu dùng iOS Simulator/Android Emulator:
   - Android: `10.0.2.2` trỏ đến localhost của máy host
   - iOS: `localhost` hoặc `127.0.0.1` hoạt động bình thường

```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Physical Device
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

## Troubleshooting

### ❌ "Cannot connect to API"

1. Kiểm tra backend server đang chạy
2. Kiểm tra URL trong .env đúng format
3. Nếu test trên thiết bị thật:
   - Dùng IP thay vì localhost
   - Tắt firewall hoặc cho phép kết nối đến port

### ❌ "Environment variable is undefined"

1. Đảm bảo variable có prefix `EXPO_PUBLIC_`
2. Restart Expo với clear cache: `npx expo start -c`
3. Kiểm tra .env file ở đúng thư mục root

### ❌ Changes không apply

- Clear cache: `npx expo start -c`
- Hoặc xóa .expo folder và restart

## Example Projects

### Backend đơn giản với Express.js

```javascript
// server.js
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/diary", (req, res) => {
  res.json({ success: true, data: [] });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
```

Chạy: `node server.js`

### Testing với Supabase

Nếu dùng Supabase, không cần backend riêng:

1. Tạo project tại [supabase.com](https://supabase.com)
2. Copy URL và Anon Key vào .env
3. Sử dụng Supabase client thay vì axios:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
);
```
