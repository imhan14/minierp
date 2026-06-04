import z from "zod";
import { TeamSchema } from "./team.schema";
import { zNumber, zString } from "./utils";

export const ProductionLogSchema = z.object({
  id: z.number().optional(),
  number_of_employee: zNumber().describe(
    JSON.stringify({
      label: "Số nhân viên",
      type: "number",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  on_work: zNumber().describe(
    JSON.stringify({
      label: "Đang làm việc",
      type: "number",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  unauthorized_absence: zString().describe(
    JSON.stringify({
      label: "Không phép",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  authorized_absence: zString().describe(
    JSON.stringify({
      label: "Có phép",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  ht_di: zString().describe(
    JSON.stringify({
      label: "HT di",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  ht_den: zString().describe(
    JSON.stringify({
      label: "HT den",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  forklift: zString().describe(
    JSON.stringify({
      label: "Xe nâng",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  shift_leader: zString().describe(
    JSON.stringify({
      label: "Trưởng ca",
      type: "text",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  teams: TeamSchema.pick({
    id: true,
    team_name: true,
  }).optional(),
  team_id: z
    .number("Vui lòng chọn tổ")
    .min(1)
    .optional()
    .describe(
      JSON.stringify({
        label: "Tổ",
        type: "number",
        tableVisible: false,
        formOrder: false,
      }),
    )
    .optional(),
  team_name: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Tổ",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    )
    .optional(),
  electric_production: zNumber().describe(
    JSON.stringify({
      label: "Điện SX",
      type: "number",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  electric_mix: zNumber().describe(
    JSON.stringify({
      label: "Điện trộn",
      type: "number",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  log_date: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Ngày tạo",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
  log_start: z
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
  log_end: zString().describe(
    JSON.stringify({
      label: "Kết thúc",
      type: "text",
      tableVisible: true,
      formOrder: 4,
    }),
  ),
  // extral_logs: z.array(z.string()).optional().nullable(),
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

export const CreateProductionLogSchema = ProductionLogSchema.omit({
  id: true,
  teams: true,
  team_name: true,
  created_at: true,
  created_by: true,
}).extend({
  team_id: z.number({ message: "Vui lòng chọn tổ" }),
  log_date: z.string("Ngày không được để trống"),
  on_work: z.number({ message: "Số lượng đang làm là bắt buộc" }).min(0),
});

export const UpdateProductionLogSchema = ProductionLogSchema.partial().pick({
  team_id: true,
  log_date: true,
  log_start: true,
  log_end: true,
  on_work: true,
  number_of_employee: true,
  authorized_absence: true,
  unauthorized_absence: true,
  forklift: true,
  shift_leader: true,
  ht_di: true,
  ht_den: true,
  electric_mix: true,
  electric_production: true,
});

export const DeleteProductionLogSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type ProductionLogType = z.infer<typeof ProductionLogSchema>;
export type ProductionLogCreatePayload = z.infer<
  typeof CreateProductionLogSchema
>;
export type ProductionLogUpdatePayload = z.infer<
  typeof UpdateProductionLogSchema
>;
