export enum FieldType {
  Text = 'Text',
  TextArea = 'TextArea',
  Checkbox = 'Checkbox',
  Radio = 'Radio',
  Select = 'Select',
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
}

export enum ConditionOperator {
  Equals = 'equals',
  NotEquals = 'notEquals',
  Contains = 'contains',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
}

export interface Condition {
  fieldId: string;
  operator: ConditionOperator;
  value: string;
  action: 'show' | 'hide';
  targetFieldId: string;
}

export interface FormSettings {
  title: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  theme: 'light' | 'dark';
}

