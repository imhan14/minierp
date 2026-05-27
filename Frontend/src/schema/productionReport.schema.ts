import z from "zod";
import { TeamSchema } from "./team.schema";
import { zNumber, zString } from "./utils";

export const ProductionReportSchema = z.object({
  id: z.number().optional(),
  report_date: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Ngày tạo",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),
  teams: TeamSchema.pick({
    id: true,
    team_name: true,
  }).optional(),
  team_id: z
    .number("Vui lòng chọn tổ")
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
    .string("Vui lòng chọn tổ")
    .optional()
    .describe(
      JSON.stringify({
        label: "Tổ",
        type: "number",
        tableVisible: true,
        formOrder: 2,
      }),
    )
    .optional(),
  furnace: zNumber().describe(
    JSON.stringify({
      label: "Number of furnace",
      type: "number",
      tableVisible: false,
      formOrder: false,
    }),
  ),
  shift: z
    .enum(["C1x8", "C2x8", "C1x12", "C2x12", "C3x8"], "Chọn ca không hợp lệ")
    .describe(
      JSON.stringify({
        label: "Shift",
        type: "text",
        tableVisible: true,
        formOrder: 3,
      }),
    ),
  start_time: zString().describe(
    JSON.stringify({
      label: "Bắt đầu",
      type: "text",
      tableVisible: true,
      formOrder: 4,
    }),
  ),
  end_time: zString().describe(
    JSON.stringify({
      label: "Kết thúc",
      type: "text",
      tableVisible: true,
      formOrder: 5,
    }),
  ),
  warehouse_check: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean("Value không hợp lệ"))
    .default(false)
    .describe(
      JSON.stringify({
        label: "Warehouse Check",
        type: "select",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  production_check: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean("Value không hợp lệ"))
    .default(false)
    .describe(
      JSON.stringify({
        label: "Production Check",
        type: "select",
        tableVisible: false,
        formOrder: false,
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

export const CreateProductionReportSchema = ProductionReportSchema.omit({
  id: true,
  teams: true,
  team_name: true,
  warehouse_check: true,
  production_check: true,
  created_at: true,
  created_by: true,
}).extend({
  team_id: z.number({ message: "Vui lòng chọn tổ" }),
  report_date: z.string("Ngày không được để trống"),
});

export const UpdateProductionReportSchema =
  ProductionReportSchema.partial().pick({
    team_id: true,
    report_date: true,
    start_time: true,
    end_time: true,
    furnace: true,
    production_check: true,
    shift: true,
    team_name: true,
    warehouse_check: true,
  });

export const DeleteProductionReportSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type ProductionReportType = z.infer<typeof ProductionReportSchema>;
export type ProductionReportCreatePayload = z.infer<
  typeof CreateProductionReportSchema
>;
export type ProductionReportUpdatePayload = z.infer<
  typeof UpdateProductionReportSchema
>;
