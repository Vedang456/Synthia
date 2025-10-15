import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl group-[.toaster]:border-2",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          success: "group-[.toaster]:border-green-500/50 group-[.toaster]:bg-green-500/10",
          error: "group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-500/10",
          warning: "group-[.toaster]:border-yellow-500/50 group-[.toaster]:bg-yellow-500/10",
          info: "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-500/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
