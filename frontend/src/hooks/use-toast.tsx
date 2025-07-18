import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastInternal } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export type ToastVariant = NonNullable<ToastProps["variant"]>;

export type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastActionElement;
  className?: string;
};

export const useToast = () => {
  const { toast: toastInternal, ...rest } = useToastInternal();

  const toast = ({ title, description, variant, action, ...props }: ToastOptions) => {
    toastInternal({
      title,
      description,
      variant,
      action,
      ...props,
    });
  };

  return {
    toast,
    ...rest,
  };
};