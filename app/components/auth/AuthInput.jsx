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
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-navy' : 'text-navy/40'
                        }`}>
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                )}

                <label
                    className={`absolute left-[${Icon ? '48px' : '16px'}] transition-all duration-200 pointer-events-none ${isFloating
                        ? '-top-2 text-[11px] bg-white px-1 ml-[-4px] text-navy font-semibold z-20'
                        : 'top-1/2 -translate-y-1/2 text-[15px] text-navy/40'
                        }`}
                    style={{ left: Icon ? '44px' : '16px' }}
                >
                    {label}
                </label>

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full h-[52px] rounded-xl pl-[${Icon ? '48px' : '16px'}] pr-[${rightElement ? '48px' : '16px'}] border-[1.5px] outline-none transition-all duration-200 text-navy text-[15px] font-normal ${error
                        ? 'border-red-500 bg-red-50/10'
                        : isFocused
                            ? 'border-navy bg-white'
                            : 'border-navy/20 bg-white hover:border-navy/40'
                        }`}
                    style={{
                        paddingLeft: Icon ? '44px' : '16px',
                        paddingRight: rightElement ? '44px' : '16px'
                    }}
                    placeholder={isFocused ? placeholder : ''}
                    {...props}
                />

                {rightElement && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
                        className="text-[12px] text-red-500 font-normal ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
