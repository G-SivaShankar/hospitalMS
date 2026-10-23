export type ModuleName =
  | "patients"
  | "doctors"
  | "appointments"
  | "billing"
  | "beds";

export type FieldValue = string | number | boolean;

export interface HospitalRecord {
  id: string;
  [key: string]: FieldValue;
}

export type HospitalData = Record<ModuleName, HospitalRecord[]>;

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "email" | "tel";
  required?: boolean;
  options?: string[];
}