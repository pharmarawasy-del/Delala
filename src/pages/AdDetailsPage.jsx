import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Phone, MapPin, Clock, User, ArrowRight, MessageCircle } from 'lucide-react';

export default function AdDetailsPage({ isLoggedIn, onLoginClick }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('ads')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setAd(data);
        } catch (error) {
            console.error('Error fetching ad details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (imageContainerRef.current) {
            const { scrollLeft, offsetWidth } = imageContainerRef.current;
            const newIndex = Math.round(scrollLeft / offsetWidth);
            setCurrentImageIndex(newIndex);
        }
    };

    const handleCallClick = () => {
        if (!isLoggedIn) {
            onLoginClick();
        } else {
            window.location.href = `tel:${ad.phone}`;
        }
    };

    const handleWhatsAppClick = () => {
        // Assuming Sudan number format or international format
        const phone = ad.phone || '';
        const message = encodeURIComponent(`مرحباً، بخصوص إعلانك "${ad.title}" على دلالة...`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    if (loading) return <div className="text-center py-20 text-gray-500">جاري التحميل...</div>;
    if (!ad) return <div className="text-center py-20 text-gray-500">الإعلان غير موجود</div>;

    const hasMultipleImages = ad.images && ad.images.length > 0;
    const imagesToDisplay = hasMultipleImages ? ad.images : [ad.image_url || "https://placehold.co/600x400?text=No+Image"];

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header / Back Button */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                </button>
                <span className="font-bold text-gray-800">تفاصيل الإعلان</span>
            </div>

            {/* Image Gallery */}
            <div className="w-full h-72 bg-gray-100 relative group">
                <div
                    ref={imageContainerRef}
                    onScroll={handleScroll}
                    className="w-full h-full overflow-x-auto flex snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                    {imagesToDisplay.map((img, index) => (
                        <div key={index} className="w-full flex-shrink-0 snap-center h-full relative">
                            <img
                                src={img}
                                alt={`${ad.title} - ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Image Counter (1/5) */}
                {hasMultipleImages && ad.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm font-medium tracking-wider">
                        {currentImageIndex + 1} / {ad.images.length}
                    </div>
                )}

                {/* Dots Indicator (Optional, centered) */}
                {hasMultipleImages && ad.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                        {ad.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-3' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title & Price */}
                <h1 className="text-2xl font-bold text-[#009688] mb-2 leading-snug">{ad.title}</h1>
                <p className="text-3xl font-bold text-[#F59E0B] mb-4">{Number(ad.price).toLocaleString()} SDG</p>

                {/* Meta Data */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{ad.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(ad.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                </div>

                {/* Seller Info Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">تم النشر بواسطة</p>
                        <p className="font-bold text-gray-800">{ad.phone || 'مستخدم دلالة'}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">التفاصيل</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                        {ad.description}
                    </p>
                </div>
            </div>

            {/* Sticky Footer (Action Bar) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                {/* Button 1: Share App (Gray/Blue) */}
                <button
                    onClick={() => {
                        const text = encodeURIComponent(`شوف الإعلان ده في دلالة! 🔥\n${ad.title} - ${Number(ad.price).toLocaleString()} SDG\n${window.location.href}`);
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>

                {/* Button 2: WhatsApp (Green) */}
                <button
                    onClick={handleWhatsAppClick}
                    className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>واتسآب</span>
                </button>

                {/* Button 3: Call (Blue) */}
                <button
                    onClick={handleCallClick}
                    className="flex-1 bg-[#115ea3] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
                >
                    <Phone className="w-5 h-5" />
                    <span>إتصال</span>
                </button>
            </div>
        </div>
    );
}
