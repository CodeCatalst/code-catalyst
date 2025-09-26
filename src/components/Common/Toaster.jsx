"use client";

import { useToast } from "../hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts
        .filter((toast) => toast.open)
        .map(function ({ id, title, description, action, onOpenChange, ...props }) {
          const variant = title === "Success" ? "success" : title === "Error" ? "error" : "default";
          return (
            <Toast key={id} variant={variant} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose toastId={id} />
            </Toast>
          );
        })}
    </div>
  );
}

export function Toast({ children, variant = "default", ...props }) {
  const baseClasses = "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full";

  const variantClasses = {
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    default: "bg-white border-gray-200 text-gray-900"
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ToastTitle({ children, ...props }) {
  return (
    <div
      className="text-sm font-semibold"
      {...props}
    >
      {children}
    </div>
  );
}

export function ToastDescription({ children, ...props }) {
  return (
    <div
      className="text-sm opacity-90"
      {...props}
    >
      {children}
    </div>
  );
}

export function ToastClose({ toastId, ...props }) {
  const { dismiss } = useToast();

  return (
    <button
      className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
      onClick={() => dismiss(toastId)}
      {...props}
    >
      <span className="sr-only">Close</span>
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}