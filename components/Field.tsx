import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

export function TextField({
  label,
  hint,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      <input
        {...props}
        className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm"
      />
      {hint ? <span className="text-xs font-normal text-ink/55">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      <textarea
        {...props}
        className="focus-ring min-h-28 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm"
      />
      {hint ? <span className="text-xs font-normal text-ink/55">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  hint,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      <select
        {...props}
        className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm"
      >
        {children}
      </select>
      {hint ? <span className="text-xs font-normal text-ink/55">{hint}</span> : null}
    </label>
  );
}
