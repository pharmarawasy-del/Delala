import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Check if app is already installed (Standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // 2. Check if user previously dismissed the prompt
        const isDismissed = localStorage.getItem('installPromptDismissed');
        if (isDismissed) return;

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-5 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300" dir="rtl">
            <div className="container mx-auto max-w-md">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#115ea3] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                            د
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">نزل تطبيق دلالة 📲</h3>
                            <p className="text-gray-500 text-sm leading-snug">تصفح أسرع، وتوفير للبيانات، ويعمل بدون نت!</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -ml-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
                    >
                        ليس الآن
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="flex-[2] bg-[#115ea3] hover:bg-[#0e4b82] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-sm"
                    >
                        <Download className="w-5 h-5" />
                        <span>تثبيت التطبيق الآن</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
