import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface AlertBoxProps {
  variant: 'success' | 'error';
  title: string;
  messages: string[];
  onClose: () => void;
}

const variantStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    titleText: "text-green-800",
    messageText: "text-green-700",
    icon: <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    titleText: "text-red-800",
    messageText: "text-red-700",
    icon: <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />,
  },
};

export const AlertBox = ({ variant, title, messages, onClose }: AlertBoxProps) => {
  if (messages.length === 0) {
    return null;
  }

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-md ${styles.bg} p-4 border ${styles.border} mb-6`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3">
          <h3 className={`text-base font-medium ${styles.titleText}`}>
            {title}
          </h3>
          <div className={`mt-2 text-base ${styles.messageText}`}>
            <ul role="list" className="list-disc space-y-1 pl-5">
              {variant === 'error' ? messages.map((message, index) => (
                <li key={index}>{message}</li>
              )) : messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.bg} ${styles.messageText} hover:bg-opacity-80`}
            >
              <span className="sr-only">Dispensar</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};