import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for class merging, standard in shadcn/ui

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    showPassword?: boolean;
    onToggle?: () => void;
    hideToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, showPassword: controlledShowPassword, onToggle, hideToggle, ...props }, ref) => {
        const [internalShowPassword, setInternalShowPassword] = useState(false);

        const isControlled = controlledShowPassword !== undefined;
        const show = isControlled ? controlledShowPassword : internalShowPassword;

        const togglePasswordVisibility = () => {
            if (onToggle) {
                onToggle();
            } else {
                setInternalShowPassword(!internalShowPassword);
            }
        };

        return (
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    className={cn(
                        "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                        hideToggle ? "" : "pr-10", // Apply pr-10 only if toggle is visible
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {!hideToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1} // Prevent tabbing to the button for smoother form navigation
                    >
                        {show ? (
                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
