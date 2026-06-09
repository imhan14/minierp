import z from "zod";
import { TeamSchema } from "./team.schema";

export const ExtraMaterialsJsonSchema = z.object({
  id: z.number().optional(),
  ingredient_name: z
    .string("Vui lòng nhập tên nguyên liệu")
    .optional()
    .describe(
      JSON.stringify({
        label: "Nguyên liệu",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  weight: z
    .number("Vui lòng nhập khối lượng")
    .optional()
    .describe(
      JSON.stringify({
        label: "Khối lượng",
        type: "number",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  real_percent: z
    .number("Không được để trống")
    .optional()
    .describe(
      JSON.stringify({
        label: "Real Percent",
        type: "number",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  note: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Note",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
});

export type ExtraMaterialsJson = z.infer<typeof ExtraMaterialsJsonSchema>;

export const MaterialReportSchema = z.object({
  id: z.number().optional(),
  teams: TeamSchema.pick({
    id: true,
    team_name: true,
  }).optional(),
  team_id: z
    .number()
    .min(1)
    .optional()
    .describe(
      JSON.stringify({
        label: "TEAM id",
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
        label: "Toor",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
  report_date: z.string().describe(
    JSON.stringify({
      label: "Ngày tạo",
      type: "text",
      tableVisible: true,
      formOrder: 2,
    }),
  ),
  shift: z
    .enum(["C1x8", "C2x8", "C1x12", "C2x12", "C3x8"], "Chọn ca không hợp lệ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Shift",
        type: "text",
        tableVisible: true,
        formOrder: 3,
      }),
    ),
  start_time: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Bắt đầu",
        type: "text",
        tableVisible: true,
        formOrder: 3,
      }),
    ),
  end_time: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Kết thúc",
        type: "text",
        tableVisible: true,
        formOrder: 4,
      }),
    ),
  // foreman_check: z.boolean(),
  extral_materials: z.array(ExtraMaterialsJsonSchema).nullable(),

  created_at: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Ngày tạo",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),

  created_by: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Người tạo",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
});

export const CreateMaterialReportSchema = MaterialReportSchema.omit({
  id: true,
  teams: true,
  team_name: true,
  created_at: true,
  created_by: true,
}).extend({
  team_id: z.number({ message: "Vui lòng chọn tổ" }),
  report_date: z.string("Ngày không được để trống"),
});

export const UpdateMaterialReportSchema = MaterialReportSchema.partial().pick({
  team_id: true,
  report_date: true,
  start_time: true,
  end_time: true,
});

export const DeleteMaterialReportSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type MaterialReportType = z.infer<typeof MaterialReportSchema>;
export type MaterialReportCreatePayload = z.infer<
  typeof CreateMaterialReportSchema
>;
export type MaterialReportUpdatePayload = z.infer<
  typeof UpdateMaterialReportSchema
>;
