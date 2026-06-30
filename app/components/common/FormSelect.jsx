"use client";

/**
 * Reusable Form Select Component
 * Matches the design system
 */
export default function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error, 
  required = false,
  placeholder = "Select an option",
  disabled = false
}) {
  const selectClasses = `w-full rounded-xl px-5 py-4 text-base border-2 transition-all ${
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
      
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <span className="text-sm text-red-600 font-medium block">{error}</span>
      )}
    </div>
  );
}
