import type { UserFilters } from "@/apis/userApi";
import userApi from "@/apis/userApi";
import type { ActionConfig } from "@/components/DataTable";
import { useEntity } from "@/hooks/useEntity";
import { useEntityForm } from "@/hooks/useEntityForm";
import { useNotify } from "@/hooks/useNotify";
import type { PopupMode } from "@/hooks/usePageForm";
import {
  CreateUserSchema,
  UpdateUserSchema,
  type UserCreatePayload,
  type UserType,
  type UserUpdatePayload,
} from "@/schema/user.schema";
import { useEffect, useMemo, useState } from "react";
import { DrawerHeader } from "@/utils/others";
import Filters from "@/components/Filters";
import { Box, Button } from "@mui/material";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/DynamicPopup";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import type { TeamType } from "@/schema/team.schema";
import teamApi from "@/apis/teamApi";
import {
  USER_ADD_FIELDS,
  USER_EDIT_FIELDS,
  USER_FIELD_CONFIGS,
  USER_TABLE_FIELDS,
} from "./utils/user.fieldConfigs";
import { userFilterOptions } from "./utils/user.constants";
import roleApi from "@/apis/roleApi";
import type { RoleType } from "@/schema/role.schema";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const UserPage = () => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>("closed");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = useMemo(() => {
    return [1, 2, 3].includes(Number(currentUser?.role));
  }, [currentUser]);
  // ── Fetch team options một lần khi mount ───────────────────────────────
  const [teamOptions, setTeamOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  useEffect(() => {
    let isMounted = true;
    const fetchUserList = async () => {
      try {
        const [resTeam, resRole] = await Promise.all([
          teamApi.getAllTeams(),
          roleApi.getAllRoles(),
        ]);
        if (isMounted) {
          const formattedTeam = resTeam.data.map((item: TeamType) => ({
            label: item.team_name,
            value: String(item.id),
          }));
          setTeamOptions(formattedTeam);
          const formattedRole = resRole.data.map((item: RoleType) => ({
            label: item.role_name,
            value: String(item.id),
          }));
          setRoleOptions(formattedRole);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchUserList();
    return () => {
      isMounted = false;
    };
  }, []);

  const { data: users, reload } = useEntity<UserType, UserType, UserFilters>(
    userApi.getAllUsers,
  );
  // ── Guard dirty ───────────────────────────────────────────────────────────
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
  // ── Form hook ─────────────────────────────────────────────────────────────
  const form = useEntityForm<UserType, UserCreatePayload, UserUpdatePayload>({
    service: {
      create: (payload) => userApi.createUser(payload),
      update: (id, payload) => userApi.updateUser(id, payload),
      delete: (id) => userApi.deleteUser(id),
    },
    createSchema: CreateUserSchema,
    updateSchema: UpdateUserSchema,
    toCreatePayload: (d) => {
      const payload = d as UserCreatePayload;
      console.log(payload);
      return payload;
    },
    toUpdatePayload: (d) => {
      const payload = d as UserUpdatePayload;
      console.log(payload);
      return payload;
    },
    defaultValues: {},
    messages: {
      createSuccess: "Tạo user thành công",
      createError: "Tạo user thât bại",
    },

    onSuccess: reload,
  });
  // ── Mở/đóng popup ────────────────────────────────────────────────────────
  const handleOpenEdit = (row: UserType) => {
    guardAction(() => {
      setSelectedUser(row);
      form.openEdit(row);
      setPopupMode("edit");
    });
  };

  const handleOpenAdd = () => {
    guardAction(() => {
      setSelectedUser(null);
      form.openAdd();
      setPopupMode("add");
    });
  };
  // ── Submit Add ─────────────
  const handleAddSubmit = async () => {
    const parsed = CreateUserSchema.safeParse(form.formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return;
    }
    try {
      await userApi.createUser(parsed.data);
      notify("Thêm user thành công!", "success");
      form.close();
      setPopupMode("closed");
      reload();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendData = err.response?.data as
          | { message?: string }
          | undefined;
        const backendMessage = backendData?.message || "Lỗi từ hệ thống!";

        notify(`Thêm thất bại: ${backendMessage}`, "error");
      } else if (err instanceof Error) {
        console.log("Lỗi hệ thống:", err.message);
        notify(err.message, "error");
      } else {
        console.log("Lỗi không xác định:", err);
        notify("Đã xảy ra lỗi không rõ nguyên nhân.", "error");
      }
      console.error(err);
    }
  };
  const handleEditSave = async () => {
    const parsed = UpdateUserSchema.safeParse(form.formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return false;
    }

    setIsSaving(true);
    try {
      const res = await userApi.updateUser(
        selectedUser!.id!,
        parsed.data as UserUpdatePayload,
      );
      const raw = res.data as UserType;
      const merged: UserType = {
        ...raw,
        team_id: raw.teams?.id ?? raw.team_id,
        team_name: raw.teams?.team_name ?? raw.team_name,
      };
      setSelectedUser(merged);
      form.openEdit(merged);

      notify("Cập nhật thành công!", "success");
      setPopupMode("closed");
      reload();
      return true;
    } catch (err) {
      if (selectedUser) form.openEdit(selectedUser);

      if (axios.isAxiosError(err)) {
        const backendData = err.response?.data as
          | { message?: string }
          | undefined;
        const backendMessage = backendData?.message || "Lỗi từ hệ thống!";

        notify(`Sửa thất bại: ${backendMessage}`, "error");
      } else if (err instanceof Error) {
        console.log("Lỗi hệ thống:", err.message);
        notify(err.message, "error");
      } else {
        console.log("Lỗi không xác định:", err);
        notify("Đã xảy ra lỗi không rõ nguyên nhân.", "error");
      }

      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  // ── Field configs ─────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = USER_TABLE_FIELDS.map((key) => {
      const cfg = USER_FIELD_CONFIGS[key]!;
      return {
        id: key as keyof UserType | "actions",
        label: cfg.label,
        // width: FIELD_WIDTHS[key],
        render: cfg.render
          ? (value: unknown) => cfg.render!(value as never, {} as UserType)
          : (value: unknown) => (value != null ? String(value) : "-"),
      };
    });
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, []);
  // ── Form fields ──────────────────────────────────────────────
  const formFields = useMemo(() => {
    const fields = popupMode === "add" ? USER_ADD_FIELDS : USER_EDIT_FIELDS;
    return fields.map((key) => {
      const f = USER_FIELD_CONFIGS[key]!;
      if (f.id !== "team_id" && f.id !== "role_id") return f;
      const isTeam = f.id === "team_id";
      const currentOptions = isTeam ? teamOptions : roleOptions;
      return {
        ...f,
        label: isTeam ? "Tên tổ" : "Tên Role",
        inputType: "autocomplete" as const,
        optionsAutoComplete: currentOptions,
        getOptionLabel: (opt: { label: string; value: string } | string) =>
          typeof opt === "string" ? opt : opt.label,
        isOptionEqualToValue: (
          opt: { label: string; value: string },
          val: { label: string; value: string } | string,
        ) => opt.value === (typeof val === "string" ? val : val?.value),
        render: (value: unknown) =>
          currentOptions.find((o) => o.value === String(value))?.label ??
          String(value ?? "-"),
      };
    });
  }, [teamOptions, roleOptions, popupMode]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = (): ActionConfig<UserType>[] => [
    {
      label: "Chi tiết",
      color: "primary",
      icon: <EditOutlinedIcon />,
      onClick: handleOpenEdit,
    },
  ];
  const popupTitle =
    popupMode === "add"
      ? "Thêm user mới"
      : `User: ${selectedUser?.username ?? ""}`;
  return (
    <>
      <Box>
        <DrawerHeader />
        <Filters
          filterOptions={userFilterOptions}
          onFilterChange={(newFilters) => reload(newFilters)}
        />
        <Box>
          {isAdmin && (
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              onClick={handleOpenAdd}
            >
              Add new Report
            </Button>
          )}

          <DataTable
            columns={columns}
            data={users}
            actions={actions}
            getRowKey={(row) => row.id}
          />

          <DynamicPopup
            open={form.isOpen}
            onClose={() => guardAction(form.close)}
            title={popupTitle}
            maxWidth="md"
            mode={form.mode === "idle" ? undefined : form.mode}
            onSubmit={popupMode === "add" ? handleAddSubmit : handleEditSave}
            isSubmitting={isSaving}
          >
            <GeneralInfoSection<UserType>
              mode="form"
              // showEditButton={popupMode === "edit"}
              displayFields={formFields}
              data={form.formData as UserType}
              onGeneralChange={(id, value) => {
                if (id === "team_id") {
                  form.setField("team_id", value ? Number(value) : undefined);
                  const label =
                    teamOptions.find((o) => o.value === value)?.label ?? "";
                  form.setField("team_name", label);
                } else if (id === "role_id") {
                  form.setField("role_id", value ? Number(value) : undefined);
                  const label2 =
                    teamOptions.find((o) => o.value === value)?.label ?? "";
                  form.setField("role_name", label2);
                } else {
                  form.setField(id, value);
                }
              }}
              errors={
                form.fieldErrors as Partial<Record<keyof UserType, string>>
              }
              disabledFields={{
                username: popupMode === "edit",
              }}
            />
          </DynamicPopup>
          <ConfirmDiscardDialog
            open={confirmOpen}
            onDiscard={handleDiscard}
            onClose={handleContinueEditing}
            onSave={async () => {
              await handleEditSave();
              setConfirmOpen(false);
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default UserPage;
