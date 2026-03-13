export interface FieldConfig<T> {
  id: keyof T | "actions";
  label: string;
  inTable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number;
  noWrap?: boolean;
  inGeneral?: boolean;
  isReadOnly?: boolean;
  isCellEditable?: boolean;
  inputType?: "text" | "number" | "date" | "select";
}
