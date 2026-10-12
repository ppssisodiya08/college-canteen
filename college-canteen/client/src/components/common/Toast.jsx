import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-300 text-green-800',
    icon: <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />,
  },
  error: {
    bg: 'bg-red-50 border-red-300 text-red-800',
    icon: <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    icon: <FiAlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50 border-blue-300 text-blue-800',
    icon: <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  },
};

export default function Toast({ toasts = [], removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${style.bg}`}
          >
            {style.icon}
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            {removeToast && (
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-charcoal-400 hover:text-charcoal-700 transition-colors p-1"
                aria-label="Close notification"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
