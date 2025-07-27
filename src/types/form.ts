export enum FieldType {
  Text = "Text",
  TextArea = "TextArea",
  Checkbox = "Checkbox",
  Radio = "Radio",
  Select = "Select",
  File = "File",
  Rating = "Rating",
  Integer = "Integer",
  Date = "Date",
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  maxRating?: number
}

export enum ConditionOperator {
  Equals = "equals",
  NotEquals = "notEquals",
  Contains = "contains",
  NotContains = "notContains",
  GreaterThan = "greaterThan",
  LessThan = "lessThan",
  IsEmpty = "isEmpty",
  IsNotEmpty = "isNotEmpty",
}

export type ConditionLogic = "AND" | "OR"

export interface Condition {
  fieldId: string
  operator: ConditionOperator
  value?: any
  action: "show" | "hide"
  targetFieldId: string
  logic?: ConditionLogic
}

export interface FormSettings {
  title: string
  description?: string
  submitButtonText: string
  successMessage: string
  theme: "light" | "dark"
}