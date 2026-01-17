/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Upload } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import {
  DefaultValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { ZodTypeAny, z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn, colSpanMap } from "@/lib/utils"
import { FormFieldSchema } from "./FormFieldSchema"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface DynamicFormProps<T extends Record<string, any>> {
  schema: FormFieldSchema<T>[]
  onSubmit: (data: T) => void
  isEdit?: boolean;
  loading?: boolean
  defaultValues?: DefaultValues<T>
  formClass?: string
  gridClass?: string
}

/* -------------------------------------------------------------------------- */
/*                              Implementation                                */
/* -------------------------------------------------------------------------- */

export default function DynamicForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  loading,
  isEdit,
  defaultValues,
  formClass,
  gridClass,
}: DynamicFormProps<T>) {
  const [open, setOpen] = useState(false)
  const [autoValue, setAutoValue] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u
  const lettersRegex = /^[A-Za-z ]+$/
  const numericRegex = /^[0-9]+$/

  console.log("Def: ", defaultValues);

  /* -------------------------- Zod schema generation ------------------------- */

  const formSchema = useMemo(() => {
    const shape: Record<string, ZodTypeAny> = {}

    schema.forEach((field) => {
      let validator = z.string()

      if (field.control === "file") {
        (validator as ZodTypeAny) = z.any()
        shape[field.name as string] = validator
        return
      }

      if (field.constraint === "emoji" && (!isEdit || !field?.editConstraint?.disabled)) validator = validator.regex(emojiRegex)
      if (field.constraint === "lettersOnly" && (!isEdit || !field?.editConstraint?.disabled)) validator = validator.regex(lettersRegex)
      if (field.constraint === "numericOnly" && (!isEdit || !field?.editConstraint?.disabled)) validator = validator.regex(numericRegex)

      if (field.validation?.required && (!isEdit || !field?.editConstraint?.disabled)) {
        validator = validator.min(1, {
          message: `${field.label} is required`,
        });
      }

      if (field.validation?.maxLength && (!isEdit || !field?.editConstraint?.disabled)) {
        validator = validator.max(field.validation.maxLength, {
          message: `${field.label} must be at most ${field.validation.maxLength} characters`,
        });
      }

      if (field.validation?.minLength && (!isEdit || !field?.editConstraint?.disabled)) {
        validator = validator.min(field.validation.minLength, {
          message: `${field.label} must be at least ${field.validation.minLength} characters`,
        });
      }

      if (field.validation?.regexMatch && (!isEdit || !field?.editConstraint?.disabled)) {
        validator = validator.regex(
          field.validation.regexMatch.pattern,
          field.validation.regexMatch.message ??
          `${field.label} is invalid`
        );
      }

      shape[field.name as string] = validator
    })

    return z.object(shape)
  }, [schema])

  type FormValues = z.infer<typeof formSchema>

  /* ------------------------------- RHF setup -------------------------------- */

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as DefaultValues<FormValues> | undefined,
  })

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    const hasFile = Object.values(data).some(
      (v) => v instanceof File
    )

    if (!hasFile) {
      onSubmit(data as unknown as T)
      return
    }

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    onSubmit(formData as unknown as T)
  }


  /* ----------------------------- Field helpers ------------------------------ */

  const applyConstraint = (value: string, constraint?: string) => {
    if (!constraint) return value
    if (constraint === "emoji") return [...value].filter(v => emojiRegex.test(v)).join("")
    if (constraint === "lettersOnly") return value.replace(/[^A-Za-z ]/g, "")
    if (constraint === "numericOnly") return value.replace(/[^0-9]/g, "")
    return value
  }

  const renderField = (field: FormFieldSchema<T>,) => {
    const value = form.watch(field.name as string)

    if (field.render) {
      return field.render({
        form,
        field: {
          name: field.name as string,
          value
        }
      })
    }

    /* ------------------------------ Color ----------------------------------- */

    if (field.control === "color") {
      return (
        <Input
          type="color"
          value={String(value ?? "#000000")}
          onChange={(e) =>
            form.setValue(field.name as string, e.target.value)
          }
          disabled={field?.editConstraint?.disabled && isEdit}
        />
      )
    }

    /* --------------------------- Autocomplete -------------------------------- */

    if (field.control === "autocomplete") {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between" disabled={field?.editConstraint?.disabled && isEdit}>
              {field.options?.find(o => o.value === autoValue)?.label ??
                field.placeholder}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[25rem] p-0">
            <Command>
              <CommandInput onValueChange={field.onSearch} />
              <CommandList>
                {field.isLoading ? (
                  <CommandEmpty className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                  </CommandEmpty>
                ) : (
                  <CommandEmpty>No results.</CommandEmpty>
                )}
                <CommandGroup>
                  {field.options?.map(opt => (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => {
                        setAutoValue(opt.value)
                        form.setValue(field.name as string, opt.value)
                        setOpen(false)
                      }}
                    >
                      {opt.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          opt.value === autoValue ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    }

    /* ------------------------------ Text / Number ---------------------------- */

    if (field.control === "text" || field.control === "number") {
      return (
        <Input
          type={field.control}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            form.setValue(
              field.name as string,
              applyConstraint(e.target.value, field.constraint)
            )
          }
          disabled={field?.editConstraint?.disabled && isEdit}
        />
      )
    }

    if (field.control === "textarea") {
      return (
        <Textarea
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            form.setValue(
              field.name as string,
              applyConstraint(e.target.value, field.constraint)
            )
          }
          disabled={field?.editConstraint?.disabled && isEdit}
        />
      )
    }

    /* ------------------------- File ------------------------------ */
    if (field.control === "file") {
      const disabled = field?.editConstraint?.disabled && isEdit

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
              const file = e.target.files?.[0] ?? null
              form.setValue(field.name as string, file)
            }}
          />

          {value ? (
            <span className="text-sm text-center px-2 break-all">
              {(value as File).name}
            </span>
          ) : (
            <>
              <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground text-center">
                {field.placeholder ?? "Upload file"}
              </span>
            </>
          )}
        </div>
      )
    }

    /* ------------------------- Dropdown / Radio ------------------------------ */

    if (field.control === "dropdown") {
      return (
        <Select
          value={value === undefined || value === null || value === "" ? undefined : String(value)}
          onValueChange={(v) => form.setValue(field.name as string, v)}
          disabled={field?.editConstraint?.disabled && isEdit}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>

          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field.control === "radio") {
      return (
        <RadioGroup
          value={String(value ?? "")}
          onValueChange={(v) =>
            form.setValue(field.name as string, v)
          }
          disabled={field?.editConstraint?.disabled && isEdit}
        >
          {field.options?.map(opt => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} />
              <span>{opt.label}</span>
            </div>
          ))}
        </RadioGroup>
      )
    }

    /* ------------------------------ Checkbox -------------------------------- */

    if (field.control === "checkbox") {
      return (
        <Checkbox
          checked={Boolean(value)}
          onCheckedChange={(v) =>
            form.setValue(field.name as string, Boolean(v))
          }
          disabled={field?.editConstraint?.disabled && isEdit}
        />
      )
    }

    return null
  }

  /* ---------------------------------- JSX ---------------------------------- */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={formClass}>
        <div className={gridClass ?? "grid grid-cols-12 gap-4"}>
          {schema.map((field) => (
            <div
              key={String(field.name)}
              className={cn(
                colSpanMap[field.layout?.colSpan ?? 12],
                field.className
              )}
            >
              <FormField
                control={form.control}
                name={field.name as string}
                disabled={field?.editConstraint?.disabled && isEdit}
                render={() => (
                  <FormItem className={field.wrapperClass}>
                    <FormLabel className={field.labelClass}>
                      {field.label}
                    </FormLabel>
                    <FormControl>{renderField(field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
