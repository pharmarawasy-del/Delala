import React from 'react';
import { Lock, X, Phone } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login
        if (onLoginSuccess) onLoginSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center pt-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-[#115ea3]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">سجل دخولك</h3>
                    <p className="text-gray-500 mb-6 text-sm">أدخل رقم هاتفك للمتابعة</p>

                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 pr-3">
                                <span className="text-gray-500 font-bold text-sm" dir="ltr">+249</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="0xxxxxxxxx"
                                className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none text-left font-medium text-lg"
                                autoFocus
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold mb-3 hover:bg-[#0d4b82] transition-colors shadow-md">
                            متابعة
                        </button>
                    </form>

                    <button
                        onClick={onClose}
                        className="text-gray-400 font-medium hover:text-gray-600 text-sm"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
