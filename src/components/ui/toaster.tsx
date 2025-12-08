"use client"

import { useToast } from "@/hooks/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed bottom-0 right-0 p-4 gap-2 flex flex-col z-50">
            {toasts.map((toast, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-md shadow-md border ${toast.variant === "destructive"
                        ? "bg-red-600 text-white border-red-700"
                        : "bg-background text-foreground border-border"
                        }`}
                >
                    {toast.title && <div className="font-semibold">{toast.title}</div>}
                    {toast.description && <div className="text-sm">{toast.description}</div>}
                </div>
            ))}
        </div>
    )
}
