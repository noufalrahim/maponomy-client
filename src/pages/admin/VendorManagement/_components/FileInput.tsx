import { Upload } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface FileInputProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
  validation?: {
    required?: boolean;
    maxLength?: number;
  };
  disabled?: boolean;
}

export default function FileInput({
  value,
  onChange,
  placeholder,
  disabled,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center",
        "aspect-square w-full cursor-pointer",
        "border-2 border-dashed rounded-md",
        "transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-primary"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange(file);
        }}
      />

      {value ? (
        <span className="text-sm text-center px-2 break-all">
          {value.name}
        </span>
      ) : (
        <>
          <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground text-center">
            {placeholder ?? "Upload file"}
          </span>
        </>
      )}
    </div>
  );
}
