import z from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),

  user_name: z
    .string()
    .min(1, "user name không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Username",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  password: z
    .string()
    .min(1, "password Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Password",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  fullname: z
    .string()
    .min(1, "full name Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Fullname",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),
  role_id: z
    .string()
    .min(1, "role_id Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Role",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
  is_active: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean("Trạng thái không hợp lệ"))
    .default(true)
    .describe(
      JSON.stringify({
        label: "Status",
        type: "select",
        tableVisible: true,
        formOrder: 3,
      }),
    ),
  created_at: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Craeted At",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
});

export const UpdateUserSchema = UserSchema.partial();

export const DeleteUserSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type UserType = z.infer<typeof UserSchema>;
export type UserCreatePayload = z.infer<typeof CreateUserSchema>;
export type UserUpdatePayload = z.infer<typeof UpdateUserSchema>;
