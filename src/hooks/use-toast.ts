import { useState, useEffect } from "react"

type ToastProps = {
    title?: string
    description?: string
    variant?: "default" | "destructive"
}

let listeners: ((toast: ToastProps) => void)[] = []

function toast(props: ToastProps) {
    listeners.forEach((listener) => listener(props))
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    useEffect(() => {
        const listener = (toast: ToastProps) => {
            setToasts((prev) => [...prev, toast])
            setTimeout(() => {
                setToasts((prev) => prev.slice(1))
            }, 3000)
        }
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    }, [])

    return {
        toast,
        toasts,
    }
}
