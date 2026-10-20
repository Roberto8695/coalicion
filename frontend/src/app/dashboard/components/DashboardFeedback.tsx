"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

type NotificationType = "success" | "error" | "info";

interface NotificationOptions {
  title: string;
  message?: string;
  type?: NotificationType;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface Toast extends NotificationOptions {
  id: number;
  type: NotificationType;
}

type PendingConfirmation = Required<ConfirmOptions>;

interface DashboardFeedbackContextValue {
  notify: (options: NotificationOptions) => void;
  confirmAction: (options: ConfirmOptions) => Promise<boolean>;
}

const DashboardFeedbackContext = createContext<DashboardFeedbackContextValue | null>(null);

export function DashboardFeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmation, setConfirmation] = useState<PendingConfirmation | null>(null);
  const toastIdRef = useRef(0);
  const confirmationResolverRef = useRef<((accepted: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((options: NotificationOptions) => {
    const id = ++toastIdRef.current;
    const toast: Toast = { ...options, id, type: options.type ?? "success" };
    setToasts((current) => [...current.slice(-2), toast]);

    const timeoutId = setTimeout(() => {
      dismissToast(id);
      timeoutIdsRef.current.delete(timeoutId);
    }, 4500);
    timeoutIdsRef.current.add(timeoutId);
  }, [dismissToast]);

  const closeConfirmation = useCallback((accepted: boolean) => {
    confirmationResolverRef.current?.(accepted);
    confirmationResolverRef.current = null;
    setConfirmation(null);
  }, []);

  const confirmAction = useCallback((options: ConfirmOptions) => {
    confirmationResolverRef.current?.(false);
    setConfirmation({
      title: options.title ?? "Confirmar eliminación",
      message: options.message,
      confirmText: options.confirmText ?? "Sí, eliminar",
      cancelText: options.cancelText ?? "Cancelar",
    });

    return new Promise<boolean>((resolve) => {
      confirmationResolverRef.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (!confirmation) return;

    confirmButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeConfirmation(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [confirmation, closeConfirmation]);

  useEffect(() => () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    confirmationResolverRef.current?.(false);
  }, []);

  return (
    <DashboardFeedbackContext.Provider value={{ notify, confirmAction }}>
      {children}

      <div
        className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const Icon = isSuccess ? IconCheck : isError ? IconAlertTriangle : IconInfoCircle;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-white shadow-2xl backdrop-blur-md ${
                isSuccess
                  ? "border-emerald-400/30 bg-emerald-950/95"
                  : isError
                    ? "border-red-400/30 bg-red-950/95"
                    : "border-blue-400/30 bg-slate-900/95"
              }`}
            >
              <div className={`mt-0.5 rounded-full p-1.5 ${
                isSuccess ? "bg-emerald-500/20 text-emerald-300" : isError ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"
              }`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm text-gray-300">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                aria-label="Cerrar notificación"
              >
                <IconX className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {confirmation ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={() => closeConfirmation(false)}
            aria-label="Cancelar y cerrar"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dashboard-confirm-title"
            aria-describedby="dashboard-confirm-description"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-500/15 p-3 text-red-400">
                  <IconTrash className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="dashboard-confirm-title" className="text-lg font-semibold text-white">
                    {confirmation.title}
                  </h2>
                  <p id="dashboard-confirm-description" className="mt-2 text-sm leading-6 text-gray-300">
                    {confirmation.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-gray-700 bg-gray-900/60 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => closeConfirmation(false)}
                className="rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {confirmation.cancelText}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => closeConfirmation(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <IconTrash className="h-4 w-4" aria-hidden="true" />
                {confirmation.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardFeedbackContext.Provider>
  );
}

export function useDashboardFeedback() {
  const context = useContext(DashboardFeedbackContext);
  if (!context) {
    throw new Error("useDashboardFeedback debe usarse dentro de DashboardFeedbackProvider");
  }
  return context;
}
