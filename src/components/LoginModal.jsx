import React, { useState } from 'react';
import { Mail, X, Loader2, LogIn, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function LoginModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [timer, setTimer] = useState(60);

    // Timer countdown effect
    React.useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    if (!isOpen) return null;

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: true,
                },
            });
            if (error) throw error;
            setOtpSent(true);
            setTimer(60); // Reset timer on successful send
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });
            if (error) throw error;

            // CRITICAL: Force reload to ensure fresh auth state and routing
            window.location.href = '/';
        } catch (err) {
            setError(err.message);
            setLoading(false); // Only stop loading on error
        }
        // Note: We intentionally don't set loading(false) on success because the page is reloading
    };

    const handleResendOtp = () => {
        handleSendOtp();
    };

    const resetState = () => {
        setEmail('');
        setOtp('');
        setOtpSent(false);
        setError(null);
        setTimer(60);
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
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${otpSent ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {otpSent ? (
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        ) : (
                            <LogIn className="w-8 h-8 text-[#115ea3]" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {otpSent ? 'أدخل رمز التحقق' : 'تسجيل الدخول'}
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        {otpSent
                            ? `تم إرسال رمز التحقق إلى ${email}`
                            : 'أدخل بريدك الإلكتروني لتسجيل الدخول'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp}>
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
                                <span>{loading ? 'جاري الإرسال...' : 'أرسل رمز التحقق'}</span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="space-y-4 mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="أدخل رمز التحقق"
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold mb-4 hover:bg-[#0d4b82] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                <span>{loading ? 'جاري التحقق...' : 'تحقق ودخول'}</span>
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || loading}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {timer > 0 ? `إعادة الإرسال (${timer})` : 'أعد إرسال الرمز'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                                >
                                    تغيير البريد
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
