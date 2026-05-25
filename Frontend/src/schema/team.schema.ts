import z from "zod";
import { UserSchema } from "./user.schema";

export const TeamSchema = z.object({
  id: z.number().optional(),

  team_name: z
    .number()
    .min(1, "Team name không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Tổ",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),
  users: UserSchema.pick({
    id: true,
    role_id: true,
    fullname: true,
  }).optional(),
  user_id: z
    .number()
    .min(1, "User Không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Tổ",
        type: "number",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
});

export const CreateTeamSchema = TeamSchema.omit({
  id: true,
});

export const UpdateTeamSchema = TeamSchema.partial();

export const DeleteTeamSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type TeamType = z.infer<typeof TeamSchema>;
export type TeamCreatePayload = z.infer<typeof CreateTeamSchema>;
export type TeamUpdatePayload = z.infer<typeof UpdateTeamSchema>;
