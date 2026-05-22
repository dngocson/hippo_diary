// ===============================================
// EXAMPLE: Sử dụng Memory Service (Simple Version)
// ===============================================

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import {
  useMemories,
  useMemoriesByDiary,
  useSearchMemories,
  useCreateMemory,
  useUpdateMemory,
  useDeleteMemory,
} from "@/app/services/supabaseMemoryService";

// ===============================================
// Example 1: Danh sách tất cả memories
// ===============================================

export function MemoriesListScreen() {
  const { data: memories, isLoading, error } = useMemories();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={memories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
          {item.content && (
            <Text style={{ marginTop: 4, color: "#666" }}>{item.content}</Text>
          )}
          {item.start_date && (
            <Text style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
              {new Date(item.start_date).toLocaleDateString()}
              {item.end_date &&
                ` - ${new Date(item.end_date).toLocaleDateString()}`}
            </Text>
          )}
        </View>
      )}
    />
  );
}

// ===============================================
// Example 2: Memories của một diary cụ thể
// ===============================================

export function DiaryMemoriesScreen({ diaryId }: { diaryId: string }) {
  const { data: memories, isLoading } = useMemoriesByDiary(diaryId);

  if (isLoading) return <Text>Loading memories...</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          padding: 16,
        }}
      >
        Kỷ Niệm ({memories?.length || 0})
      </Text>

      {memories && memories.length > 0 ? (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.title}
              </Text>
              {item.content && (
                <Text style={{ marginTop: 4 }}>{item.content}</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
          Chưa có kỷ niệm nào
        </Text>
      )}
    </View>
  );
}

// ===============================================
// Example 3: Search Memories
// ===============================================

export function SearchMemoriesScreen() {
  const [keyword, setKeyword] = useState("");
  const { data: results, isLoading } = useSearchMemories(keyword);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm kiếm kỷ niệm..."
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          margin: 16,
          borderRadius: 8,
        }}
      />

      {isLoading && <Text>Searching...</Text>}

      {results && results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.title}
              </Text>
              {item.content && (
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {item.content}
                </Text>
              )}
            </View>
          )}
        />
      ) : keyword.length >= 2 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Không tìm thấy kết quả
        </Text>
      ) : null}
    </View>
  );
}

// ===============================================
// Example 4: Create Memory
// ===============================================

export function CreateMemoryScreen({ diaryId }: { diaryId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const createMutation = useCreateMemory();

  const handleSubmit = () => {
    if (!title) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    createMutation.mutate(
      {
        diary_id: diaryId,
        title,
        content: content || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
      {
        onSuccess: () => {
          alert("✅ Đã tạo kỷ niệm mới!");
          setTitle("");
          setContent("");
          setStartDate("");
          setEndDate("");
        },
        onError: (error) => {
          alert(`❌ Lỗi: ${error.message}`);
        },
      },
    );
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Tạo Kỷ Niệm Mới
      </Text>

      <Text style={{ fontWeight: "600", marginTop: 12 }}>Tiêu đề *</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề kỷ niệm..."
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
          marginTop: 4,
        }}
      />

      <Text style={{ fontWeight: "600", marginTop: 12 }}>Nội dung</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Viết về kỷ niệm của bạn..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
          marginTop: 4,
          minHeight: 120,
        }}
      />

      <Text style={{ fontWeight: "600", marginTop: 12 }}>
        Ngày bắt đầu (tuỳ chọn)
      </Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD HH:MM:SS"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
          marginTop: 4,
        }}
      />

      <Text style={{ fontWeight: "600", marginTop: 12 }}>
        Ngày kết thúc (tuỳ chọn)
      </Text>
      <TextInput
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD HH:MM:SS"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
          marginTop: 4,
        }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={createMutation.isPending || !title}
        style={{
          backgroundColor: "#007AFF",
          padding: 16,
          borderRadius: 8,
          marginTop: 24,
          alignItems: "center",
          opacity: !title ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {createMutation.isPending ? "Đang lưu..." : "Tạo Kỷ Niệm"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ===============================================
// Example 5: Edit & Delete Memory
// ===============================================

export function EditMemoryScreen({ memoryId }: { memoryId: string }) {
  const updateMutation = useUpdateMemory();
  const deleteMutation = useDeleteMemory();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleUpdate = () => {
    if (!title) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    updateMutation.mutate(
      {
        id: memoryId,
        title,
        content,
      },
      {
        onSuccess: () => {
          alert("✅ Đã cập nhật!");
        },
      },
    );
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa kỷ niệm này?")) {
      deleteMutation.mutate(memoryId, {
        onSuccess: () => {
          alert("✅ Đã xóa!");
          // Navigate back
        },
      });
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "600" }}>Tiêu đề</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Tiêu đề"
        style={{ borderWidth: 1, padding: 12, marginTop: 4, borderRadius: 8 }}
      />

      <Text style={{ fontWeight: "600", marginTop: 12 }}>Nội dung</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Nội dung"
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          minHeight: 100,
          marginTop: 4,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={updateMutation.isPending}
        style={{
          backgroundColor: "#007AFF",
          padding: 16,
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          {updateMutation.isPending ? "Đang cập nhật..." : "Cập Nhật"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        disabled={deleteMutation.isPending}
        style={{
          backgroundColor: "#ff3b30",
          padding: 16,
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          {deleteMutation.isPending ? "Đang xóa..." : "Xóa Kỷ Niệm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
