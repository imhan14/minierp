import z from "zod";

export const RoleSchema = z.object({
  id: z.number().optional(),

  role_name: z
    .string()
    .min(1, "Role name không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Role name",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),

  priority_level: z
    .number()
    .min(1, "User Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Level",
        type: "number",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
});

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
});

export const UpdateRoleSchema = RoleSchema.partial();

export const DeleteRoleSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type RoleType = z.infer<typeof RoleSchema>;
export type RoleCreatePayload = z.infer<typeof CreateRoleSchema>;
export type RoleUpdatePayload = z.infer<typeof UpdateRoleSchema>;
