"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthInput({
    label,
    icon: Icon,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    rightElement,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const isFloating = isFocused || value;

    return (
        <div className="space-y-1.5 w-full">
            <div className="relative group">
                {Icon && (
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-navy' : 'text-navy/40'
                        }`}>
                        <Icon size={17} strokeWidth={1.5} />
                    </div>
                )}

                <label
                    className={`absolute transition-all duration-200 pointer-events-none ${isFloating
                        ? '-top-2 text-[10px] bg-white px-1 ml-[-4px] text-navy font-semibold z-20'
                        : 'top-1/2 -translate-y-1/2 text-[13px] text-navy/40'
                        }`}
                    style={{ left: Icon ? '40px' : '14px' }}
                >
                    {label}
                </label>

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full h-[48px] rounded-xl border outline-none transition-all duration-200 text-navy text-sm font-normal ${error
                        ? 'border-red-400 bg-red-50/10'
                        : isFocused
                            ? 'border-navy bg-white shadow-sm shadow-navy/5'
                            : 'border-navy/15 bg-white hover:border-navy/30'
                        }`}
                    style={{
                        paddingLeft: Icon ? '40px' : '14px',
                        paddingRight: rightElement ? '40px' : '14px'
                    }}
                    placeholder={isFocused ? placeholder : ''}
                    {...props}
                />

                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[11px] text-red-500 font-normal ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
