import z from "zod";

export const diaryEntrySchema = z.object({
  content: z
    .string()
    .min(10, "Nội dung nhật ký phải có ít nhất 10 ký tự")
    .max(5000, "Nội dung nhật ký không được vượt quá 5000 ký tự"),
  mood: z.string().min(1, "Vui lòng chọn tâm trạng của bạn").optional(),
  activities: z.string().optional(),
});
