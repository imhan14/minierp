import type { ZodSchema } from "zod";
import { useNotify } from "./useNotify";
import { useCallback, useRef, useState } from "react";
import { validateWithZod } from "@/utils/validate";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface EntityService<T, CreatePayload, UpdatePayload> {
  create: (payload: CreatePayload) => Promise<{ data: T }>;
  update: (id: number, payload: UpdatePayload) => Promise<{ data: T }>;
  delete: (id: number) => Promise<unknown>;
}

/** Config cho useEntityForm */
export interface UseEntityFormConfig<T, CreatePayload, UpdatePayload> {
  service: EntityService<T, CreatePayload, UpdatePayload>;
  createSchema: ZodSchema<CreatePayload>;
  updateSchema: ZodSchema<UpdatePayload>;

  /**
   * Transform formData → payload trước khi gọi API create.
   * Dùng để format date, coerce type, loại bỏ field thừa, v.v.
   */
  toCreatePayload: (formData: Partial<T>) => CreatePayload;

  /**
   * Transform formData → payload trước khi gọi API update.
   * Nếu không truyền, mặc định dùng toCreatePayload.
   */
  toUpdatePayload?: (formData: Partial<T>) => UpdatePayload;

  /**
   * Giá trị mặc định khi mở form Add New.
   * Có thể là object rỗng hoặc preset một số field.
   */
  defaultValues: Partial<T>;

  /** Callback gọi sau mỗi thao tác thành công (refresh data) */
  onSuccess: () => void;

  /** Thông báo tuỳ chỉnh. Mặc định dùng message chung. */
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };
}

/** State trả về từ hook */
export interface UseEntityFormReturn<T> {
  // ─── Form state ────────────────────────────────────────────────────────────
  /** Dữ liệu đang được chỉnh sửa trong form */
  formData: Partial<T>;

  /** Lỗi validation theo từng field key */
  fieldErrors: Record<string, string>;

  /** Mode hiện tại của form */
  mode: "idle" | "add" | "edit";

  /** Form đang ở trạng thái submit */
  isSubmitting: boolean;

  /** Form đang ở trạng thái delete */
  isDeleting: boolean;

  // ─── Derived state ─────────────────────────────────────────────────────────
  /** true nếu form đang mở (mode !== 'idle') */
  isOpen: boolean;

  /** true nếu form có thay đổi chưa lưu (dirty check) */
  isDirty: boolean;

  /** ID của record đang edit (null nếu là add new) */
  editingId: number | string | null;

  // ─── Actions ───────────────────────────────────────────────────────────────
  /** Mở form Add New với defaultValues */
  openAdd: () => void;

  /** Mở form Edit với data của record */
  openEdit: (record: T) => void;

  /** Đóng form, reset state */
  close: () => void;

  /** Cập nhật 1 field trong formData */
  setField: (key: keyof T, value: unknown) => void;

  /** Cập nhật nhiều field cùng lúc */
  setFields: (fields: Partial<T>) => void;

  /** Submit form (validate → create hoặc update tuỳ mode) */
  submit: () => Promise<void>;

  /** Xóa record (có confirm) */
  deleteRecord: (record: T, confirmMessage?: string) => Promise<void>;
}

// ─── ID resolution ────────────────────────────────────────────────────────────

/** Heuristic tìm id field trong record (id, _id, hoặc field đầu tiên là number) */
function resolveId<T>(record: T): number | string | null {
  if (!record || typeof record !== "object") return null;
  const obj = record as Record<string, unknown>;
  if (
    "id" in obj &&
    (typeof obj.id === "number" || typeof obj.id === "string")
  ) {
    return obj.id as number | string;
  }
  if ("_id" in obj) return obj._id as string;
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEntityForm<
  T extends object,
  CreatePayload = Partial<T>,
  UpdatePayload = Partial<T>,
>(
  config: UseEntityFormConfig<T, CreatePayload, UpdatePayload>,
): UseEntityFormReturn<T> {
  const {
    service,
    createSchema,
    updateSchema,
    toCreatePayload,
    toUpdatePayload,
    defaultValues,
    onSuccess,
    messages = {},
  } = config;

  const notify = useNotify();

  // ─── Core state ─────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [formData, setFormData] = useState<Partial<T>>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  /** Snapshot của dữ liệu khi mở form để dirty check */
  const originalDataRef = useRef<Partial<T>>(defaultValues);

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const isOpen = mode !== "idle";
  const isDirty =
    JSON.stringify(formData) !== JSON.stringify(originalDataRef.current);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const openAdd = useCallback(() => {
    setFormData({ ...defaultValues });
    originalDataRef.current = { ...defaultValues };
    setFieldErrors({});
    setEditingId(null);
    setMode("add");
  }, [defaultValues]);

  const openEdit = useCallback((record: T) => {
    setFormData({ ...record });
    originalDataRef.current = { ...record };
    setFieldErrors({});
    setEditingId(resolveId(record));
    setMode("edit");
  }, []);

  const close = useCallback(() => {
    setMode("idle");
    setFormData({ ...defaultValues });
    setFieldErrors({});
    setEditingId(null);
    originalDataRef.current = { ...defaultValues };
  }, [defaultValues]);

  const setField = useCallback((key: keyof T, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Xóa lỗi của field khi user bắt đầu nhập lại
    setFieldErrors((prev) => {
      if (!((key as string) in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const setFields = useCallback((fields: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      if (mode === "add") {
        // Validate với createSchema
        const payload = toCreatePayload(formData);
        const result = validateWithZod(createSchema, payload);

        if (!result.isValid) {
          // Trả lỗi chi tiết theo field nếu có
          if ("errors" in result && result.errors) {
            setFieldErrors(result.errors as Record<string, string>);
          }
          notify(result.message ?? "Dữ liệu không hợp lệ", "error");
          return;
        }
        await service.create(result.data);
        notify(messages.createSuccess ?? "Thêm mới thành công!", "success");
        close();
        onSuccess();
      } else if (mode === "edit") {
        if (!editingId) {
          notify("Không tìm thấy ID bản ghi cần cập nhật", "error");
          return;
        }

        // Validate với updateSchema
        const resolvedToUpdatePayload =
          toUpdatePayload ??
          (toCreatePayload as unknown as (d: Partial<T>) => UpdatePayload);
        const payload = resolvedToUpdatePayload(formData);
        const result = validateWithZod(updateSchema, payload);

        if (!result.isValid) {
          if ("errors" in result && result.errors) {
            setFieldErrors(result.errors as Record<string, string>);
          }
          notify(result.message ?? "Dữ liệu không hợp lệ", "error");
          return;
        }

        await service.update(editingId, result.data);
        notify(messages.updateSuccess ?? "Cập nhật thành công!", "success");
        close();
        onSuccess();
      }
    } catch (err) {
      const errorMsg =
        mode === "add"
          ? (messages.createError ?? "Lỗi khi thêm mới!")
          : (messages.updateError ?? "Lỗi khi cập nhật!");
      notify(errorMsg, "error");
      console.error("[useEntityForm] submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    mode,
    formData,
    editingId,
    createSchema,
    updateSchema,
    toCreatePayload,
    toUpdatePayload,
    service,
    notify,
    messages,
    close,
    onSuccess,
  ]);

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const deleteRecord = useCallback(
    async (
      record: T,
      confirmMessage = "Bạn có chắc chắn muốn xóa bản ghi này?",
    ) => {
      const id = resolveId(record);
      if (!id) {
        notify("Không tìm thấy ID bản ghi cần xóa", "error");
        return;
      }

      if (!window.confirm(confirmMessage)) return;

      setIsDeleting(true);
      try {
        await service.delete(id);
        notify(messages.deleteSuccess ?? "Xóa thành công!", "success");
        onSuccess();
      } catch (err) {
        notify(messages.deleteError ?? "Lỗi khi xóa!", "error");
        console.error("[useEntityForm] delete error:", err);
      } finally {
        setIsDeleting(false);
      }
    },
    [service, notify, messages, onSuccess],
  );

  // ─── Return ───────────────────────────────────────────────────────────────────

  return {
    // state
    formData,
    fieldErrors,
    mode,
    isSubmitting,
    isDeleting,
    isOpen,
    isDirty,
    editingId,
    // actions
    openAdd,
    openEdit,
    close,
    setField,
    setFields,
    submit,
    deleteRecord,
  };
}
