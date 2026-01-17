import { ECustomerType, EOrderStatus } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const clamp = (val: unknown, limit: number = 30): string => {
  if (val === null || val === undefined) return "";

  const str = String(val);

  if (str.length === 0) return "";

  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  }

  return str;
};


export const withNA = (value: unknown): string | number => {
  if (value === null || value === undefined || value === "") return "N/A";

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? "N/A" : value.toLocaleDateString();
  }

  if (typeof value === "string") {
    return value.trim() === "" ? "N/A" : value;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? "N/A" : value;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return "N/A";
};

export const randomGenerator = (
  constraints?: {
    length?: number
  }
) => {
  const { length = 10 } = constraints || {};
  return Math.random().toString(36).slice(-length);
}


export const colSpanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

export const badgeFields = (status: EOrderStatus | 'active' | 'inactive' | ECustomerType | undefined) => {
  switch (status) {
    case "active":
      return {
        bgColor: 'bg-green-100 hover:bg-green-200/80 border border-green-500 rounded-xl',
        textColor: 'text-green-700',
        text: 'Active'
      }
    case "inactive":
      return {
        bgColor: 'bg-red-100 hover:bg-red-200/80 border border-red-500 rounded-xl',
        textColor: 'text-red-700',
        text: 'Inactive'
      };
    case EOrderStatus.PENDING:
      return {
        bgColor: 'bg-amber-100 hover:bg-amber-200/80 border border-amber-500 rounded-xl',
        textColor: 'text-amber-700',
        text: 'Pending'
      };
    case EOrderStatus.CONFIRMED:
      return {
        bgColor: 'bg-orange-100 hover:bg-orange-200/80 border border-orange-500 rounded-xl',
        textColor: 'text-orange-700',
        text: 'Confirmed'
      };
    case EOrderStatus.REJECTED:
      return {
        bgColor: 'bg-red-100 hover:bg-red-200/80 border border-red-500 rounded-xl',
        textColor: 'text-red-700',
        text: 'Rejected'
      };
    case EOrderStatus.DELIVERED:
      return {
        bgColor: 'bg-green-100 hover:bg-green-200/80 border border-green-500 rounded-xl',
        textColor: 'text-green-700',
        text: 'Delivered'
      }
    case EOrderStatus.CANCELLED:
      return {
        bgColor: 'bg-red-100 hover:bg-red-200/80 border border-red-500 rounded-xl',
        textColor: 'text-red-700',
        text: 'Cancelled'
      };
    case ECustomerType.OWN:
      return {
        bgColor: 'bg-white text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100',
        textColor: 'text-gray-600',
        text: 'Own'
      }
    case ECustomerType.EXTERNAL:
      return {
        bgColor: 'bg-white text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100',
        textColor: 'text-gray-600',
        text: 'External'
      }
    default:
      return {
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        text: 'N/A'
      };
  }
}

export function daysLeftInCurrentMonth() {
  const now = new Date();

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffMs = endOfMonth.getTime() - today.getTime();

  return Math.max(
    Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
    0
  );
}
 
export const offsetCalculator = (pagination?: { pageSize?: number; pageIndex?: number }) => {
    const { pageSize = 10, pageIndex = 0 } = pagination || {};
    return pageSize * pageIndex;
}
