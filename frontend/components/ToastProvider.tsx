import React, { useState, useCallback } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import type { Toast } from '../types';

// --- Icon Components ---
const SuccessIcon = () => (
    <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);
const ErrorIcon = () => (
    <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);
const CloseIcon = () => (
     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
)

// --- Single Toast Notification Component ---
interface ToastNotificationProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 300); // Wait for animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);
    
    const handleDismiss = () => {
         setIsExiting(true);
         setTimeout(() => onDismiss(toast.id), 300);
    }

    const toastStyles = {
        success: 'bg-green-500/10 border-green-500/30',
        error: 'bg-red-500/10 border-red-500/30',
    };

    return (
        <div className={`w-full max-w-sm rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border ${toastStyles[toast.type]} ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                           {toast.type === 'success' ? 'Success' : 'Error'}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {toast.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={handleDismiss} className="rounded-md inline-flex text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500">
                            <span className="sr-only">Close</span>
                            <CloseIcon/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Toast Provider ---
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: Toast['type']) => {
        const id = crypto.randomUUID();
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {toasts.map(toast => (
                        <ToastNotification key={toast.id} toast={toast} onDismiss={removeToast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};