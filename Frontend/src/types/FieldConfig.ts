import type { Theme } from "@emotion/react";
import type { SxProps } from "@mui/material";

export interface FieldConfig<T> {
  id: keyof T | string;
  label: string;
  inputType?:
    | "text"
    | "number"
    | "date"
    | "time"
    | "select"
    | "datetime-local"
    | "autocomplete";
  type?: "text" | "number" | "select" | "date" | "autocomplete" | "textarea";
  //Table Display
  sortable?: boolean;
  width?: number;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  //Form
  required?: boolean;
  inTable?: boolean;
  // validation?: ZodType;
  options?: { label: string; value: string; text?: string; bg?: string }[];
  disabled?: boolean | ((data: T) => boolean);
  hidden?: boolean | ((data: T) => boolean);

  align?: "left" | "right" | "center";

  noWrap?: boolean;
  inGeneral?: boolean;
  isReadOnly?: boolean;
  isCellEditable?: boolean;
  optionsAutoComplete?: any[];
  getOptionLabel?: (option: any) => string;
  isOptionEqualToValue?: (option: any, value: any) => boolean;

  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number };
  sx?: SxProps<Theme>;
  hideEmptyRows?: boolean;
  readRoles?: string[]; // chỉ role này mới thấy
  editRoles?: string[];
}
