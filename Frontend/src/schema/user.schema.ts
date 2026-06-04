import z from "zod";
import { RoleSchema } from "./role.schema";
import { TeamSchema } from "./team.schema";

export const UserSchema = z.object({
  id: z.number().optional(),

  username: z
    .string("Vui lòng nhập username!")
    .min(3, "username ít nhất 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Username",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),
  new_password: z
    .string("Vui lòng nhập mật khẩu")
    .min(8, "password ít nhất 8 ký tự")
    .describe(
      JSON.stringify({
        label: "Password",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  full_name: z
    .string("Vui lòng nhập Full Name")
    .min(2, "full name Không hợp lệ")
    .describe(
      JSON.stringify({
        label: "Fullname",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
  roles: RoleSchema.pick({
    id: true,
    role_name: true,
  })
    .optional()
    .describe(
      JSON.stringify({
        label: "Roles",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  role_id: z
    .number("Vui lòng chọn role")
    .min(1, "role_id Không hợp lệ")
    .describe(
      JSON.stringify({
        label: "Role",
        type: "number",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  role_name: z
    .string("Vui lòng chọn role")
    .min(1, "role name Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Role",
        type: "text",
        tableVisible: true,
        formOrder: 3,
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
        formOrder: 4,
      }),
    ),
  teams: TeamSchema.pick({
    id: true,
    team_name: true,
  })
    .optional()
    .describe(
      JSON.stringify({
        label: "Teams",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  team_id: z
    .number("Vui lòng chọn team")
    .min(1, "Team_id Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Team",
        type: "number",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  team_name: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Team",
        type: "text",
        tableVisible: true,
        formOrder: 5,
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

export const CreateUserSchema = UserSchema.pick({
  username: true,
  new_password: true,
  role_id: true,
  full_name: true,
});
export const UpdateUserSchema = UserSchema.pick({
  new_password: true,
  full_name: true,
  is_active: true,
  role_id: true,
  team_id: true,
}).partial();

export const DeleteUserSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type UserType = z.infer<typeof UserSchema>;
export type UserCreatePayload = z.infer<typeof CreateUserSchema>;
export type UserUpdatePayload = z.infer<typeof UpdateUserSchema>;
