import { toast } from "sonner";

// Enhanced toast function with auto-dismiss timers and better styling
export const showToast = {
  success: (message: string, options?: { duration?: number; description?: string }) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  error: (message: string, options?: { duration?: number; description?: string }) => {
    return toast.error(message, {
      duration: options?.duration || 5000, // Errors stay longer
      description: options?.description,
    });
  },

  info: (message: string, options?: { duration?: number; description?: string }) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  warning: (message: string, options?: { duration?: number; description?: string }) => {
    return toast.warning(message, {
      duration: options?.duration || 4500,
      description: options?.description,
    });
  },

  loading: (message: string, options?: { duration?: number; description?: string }) => {
    return toast.loading(message, {
      duration: options?.duration || 3000, // Loading messages are shorter
      description: options?.description,
    });
  },

  // Promise-based toast for async operations
  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: {
      duration?: number;
      description?: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => messages.success,
      error: (error) => messages.error,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Custom toast with icon
  custom: (message: string, icon?: React.ReactNode, options?: { duration?: number; description?: string; type?: 'success' | 'error' | 'info' | 'warning' }) => {
    const type = options?.type || 'info';
    return toast(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      icon,
    });
  }
};
