import React from 'react';
import { Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OathModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handlePledge = () => {
        onClose();
        navigate('/post-ad');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-100">
                        <Shield className="w-10 h-10 text-[#009688]" />
                    </div>

                    <h3 className="text-2xl font-black mb-4 text-gray-900" style={{ fontFamily: "'Cairo', sans-serif" }}>
                        معاهدة دلالــــــة
                    </h3>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                        <p className="text-xl font-bold text-gray-800 leading-relaxed" style={{ fontFamily: "'Amiri', serif" }}>
                            "أقسم بالله العظيم أن ألتزم بالمصداقية الكاملة في وصفي للسلعة، وأن لا أبخس الناس أشياءهم، وأن أدفع عمولة الموقع (إن وجدت) في ذمتي بعد إتمام البيع."
                        </p>
                    </div>

                    <button
                        onClick={handlePledge}
                        className="w-full bg-[#009688] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00796b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        أتعهد وأقسم بذلك
                    </button>
                </div>
            </div>
        </div>
    );
}
