"use client";

/**
 * Reusable Form Input Component
 * Matches the design system
 */
export default function FormInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  disabled = false,
  maxLength,
  rows
}) {
  const inputClasses = `w-full rounded-xl px-5 py-4 text-base border-2 transition-all ${
    error 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
      : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
  } outline-none disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-zinc-600 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rows || 4}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={inputClasses}
        />
      )}
      
      {error && (
        <span className="text-sm text-red-600 font-medium block">{error}</span>
      )}
      
      {maxLength && value && (
        <span className="text-sm text-zinc-500 block text-right">
          {value.length} / {maxLength}
        </span>
      )}
    </div>
  );
}
