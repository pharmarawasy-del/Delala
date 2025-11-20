import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SafetyBanner() {
    return (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
            <div className="container mx-auto flex items-center justify-center gap-2 text-yellow-800">
                <ShieldAlert className="w-5 h-5" />
                <p className="text-sm font-medium">تنبيه: افحص السلعة جيداً قبل الدفع. لا تحول أموال مسبقاً.</p>
            </div>
        </div>
    );
}
