import React, { useState } from 'react';
import { Mail, X, Loader2, LogIn, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function LoginModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [linkSent, setLinkSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });
            if (error) throw error;
            setLinkSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setEmail('');
        setLinkSent(false);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200 shadow-xl">
                <button
                    onClick={resetState}
                    className="absolute top-4 left-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center pt-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${linkSent ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {linkSent ? (
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        ) : (
                            <LogIn className="w-8 h-8 text-[#115ea3]" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {linkSent ? 'تم إرسال الرابط' : 'تسجيل الدخول'}
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        {linkSent
                            ? 'تم إرسال رابط الدخول إلى بريدك الإلكتروني. يمكنك إغلاق هذه النافذة والمتابعة من هناك.'
                            : 'أدخل بريدك الإلكتروني لتسجيل الدخول'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {!linkSent ? (
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4 mb-6">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="البريد الإلكتروني"
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold mb-4 hover:bg-[#0d4b82] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                <span>{loading ? 'جاري الإرسال...' : 'أرسل رابط الدخول'}</span>
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => setLinkSent(false)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                أعد إرسال الرابط
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
