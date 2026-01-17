/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";

export type ControlType =
  | "text"
  | "number"
  | "textarea"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "color"
  | "autocomplete"
  | "file";

export interface FormFieldOption<T = any> {
  label: string;
  value: T;
}

export interface FormFieldSchema<T extends Record<string, any>> {
  name: string;
  label: string;
  control: ControlType;

  placeholder?: string;

  options?: FormFieldOption<T[keyof T]>[];

  editConstraint?: {
    disabled?: boolean;
  },

  validation?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    regexMatch?: {
      pattern: RegExp;
      message?: string;
    };
  };

  constraint?: "emoji" | "lettersOnly" | "numericOnly" | "email";

  layout?: { colSpan?: number };

  className?: string;
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;

  onSearch?: (keyword: string) => void;
  isLoading?: boolean;

  /** full escape hatch — intentionally preserved */
  render?: (props: {
    form: ReturnType<typeof useForm>
    field: {
      name: string
      value: any
    }
  }) => React.ReactNode
}
