import { useState } from "react";
import type { ZodSchema } from "zod";
import { useEntityForm } from "./useEntityForm";
import { useNotify } from "./useNotify";
import type { EntityService } from "./useEntityForm";

type WithId = { id?: number | string };

interface UsePageFormConfig<T extends WithId, CreatePayload, UpdatePayload> {
  service: EntityService<T, CreatePayload, UpdatePayload>;
  createSchema: ZodSchema<CreatePayload>;
  updateSchema: ZodSchema<UpdatePayload>;
  toCreatePayload?: (d: Partial<T>) => CreatePayload;
  toUpdatePayload?: (d: Partial<T>) => UpdatePayload;
  defaultValues: Partial<T>;
  onSuccess: () => void;
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };
  /**
   * Flatten nested API response sau khi update.
   * Ví dụ: { teams: { id, team_name } } → { team_id, team_name }
   */
  flattenResponse?: (raw: T) => T;
}

export type PopupMode = "closed" | "add" | "edit";

export function usePageForm<
  T extends WithId,
  CreatePayload = Partial<T>,
  UpdatePayload = Partial<T>,
>(config: UsePageFormConfig<T, CreatePayload, UpdatePayload>) {
  const {
    service,
    createSchema,
    updateSchema,
    toCreatePayload,
    toUpdatePayload,
    defaultValues,
    onSuccess,
    messages,
    flattenResponse,
  } = config;

  const notify = useNotify();

  const [popupMode, setPopupMode] = useState<PopupMode>("closed");
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const form = useEntityForm<T, CreatePayload, UpdatePayload>({
    service,
    createSchema,
    updateSchema,
    toCreatePayload: toCreatePayload ?? ((d) => d as CreatePayload),
    toUpdatePayload: toUpdatePayload ?? ((d) => d as UpdatePayload),
    defaultValues,
    onSuccess,
    messages,
  });

  // ── Guard ─────────────────────────────────────────────────────────────────
  const guardAction = (action: () => void) => {
    if (form.isDirty) {
      setPendingAction(() => action);
      setConfirmOpen(true);
    } else {
      action();
    }
  };

  const handleDiscard = () => {
    form.close();
    setConfirmOpen(false);
    pendingAction?.();
    setPendingAction(null);
  };

  const handleContinueEditing = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  // ── Popup ─────────────────────────────────────────────────────────────────
  const handleOpenEdit = (row: T) => {
    guardAction(() => {
      setSelectedRecord(row);
      form.openEdit(row);
      setPopupMode("edit");
    });
  };

  const handleOpenAdd = (overrides?: Partial<T>) => {
    guardAction(() => {
      setSelectedRecord(null);
      form.openAdd();
      if (overrides) {
        (Object.keys(overrides) as (keyof T)[]).forEach((key) => {
          form.setField(key, overrides[key]);
        });
      }
      setPopupMode("add");
    });
  };

  const handleClosePopup = () => {
    if (popupMode === "edit") {
      guardAction(() => {
        form.close();
        setPopupMode("closed");
      });
    } else {
      form.close();
      setPopupMode("closed");
    }
  };

  // ── Helper──────────────────────
  const cleanFormData = (data: Partial<T>): Partial<T> =>
    Object.fromEntries(
      Object.entries(data).filter(
        ([, v]) => v !== null && v !== undefined && v !== "",
      ),
    ) as Partial<T>;

  // ── Add submit ────────────────────────────────────────────────────────────
  const handleAddSubmit = async () => {
    const parsed = createSchema.safeParse(cleanFormData(form.formData));
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return;
    }
    try {
      await service.create(parsed.data as CreatePayload);
      notify(messages?.createSuccess ?? "Thêm mới thành công!", "success");
      form.close();
      setPopupMode("closed");
      onSuccess();
    } catch (err) {
      notify(messages?.createError ?? "Lỗi khi thêm mới!", "error");
      console.error(err);
    }
  };

  // ── Edit save ─────────────────────────────────────────────────────────────
  const handleEditSave = async (): Promise<boolean> => {
    const parsed = updateSchema.safeParse(cleanFormData(form.formData));
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return false;
    }

    const id = selectedRecord?.id;
    if (!id) {
      notify("Không tìm thấy ID bản ghi", "error");
      return false;
    }

    setIsSaving(true);
    try {
      const res = await service.update(
        Number(id),
        parsed.data as UpdatePayload,
      );
      const raw = res.data as T;
      const merged = flattenResponse ? flattenResponse(raw) : raw;

      setSelectedRecord(merged);
      form.openEdit(merged);
      notify(messages?.updateSuccess ?? "Cập nhật thành công!", "success");
      onSuccess();
      return true;
    } catch (err) {
      if (selectedRecord) form.openEdit(selectedRecord);
      notify(messages?.updateError ?? "Lỗi khi cập nhật!", "error");
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    popupMode,
    selectedRecord,
    isSaving,
    confirmOpen,
    guardAction,
    handleDiscard,
    handleContinueEditing,
    handleOpenEdit,
    handleOpenAdd,
    handleClosePopup,
    handleAddSubmit,
    handleEditSave,
    setPopupMode,
    setConfirmOpen,
  };
}
