import type { Theme } from "@emotion/react";
import type { SxProps } from "@mui/material";

export interface FieldConfig<T> {
  id: keyof T | string;
  label: string;
  inTable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number;
  noWrap?: boolean;
  inGeneral?: boolean;
  isReadOnly?: boolean;
  isCellEditable?: boolean;
  optionsAutoComplete?: any[];
  getOptionLabel?: (option: any) => string;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  inputType?:
    | "text"
    | "number"
    | "date"
    | "time"
    | "select"
    | "datetime-local"
    | "autocomplete";
  options?: { label: string; value: string; text?: string; bg?: string }[];
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number };
  sx?: SxProps<Theme>;
  hideEmptyRows?: boolean;
}
