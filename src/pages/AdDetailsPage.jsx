import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Phone, MapPin, Clock, User, ArrowRight, MessageCircle, Heart, Share2, Flag, Send } from 'lucide-react';

export default function AdDetailsPage({ isLoggedIn, onLoginClick }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [commentText, setCommentText] = useState('');
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
        const phone = ad.phone || '';
        const message = encodeURIComponent(`مرحباً، بخصوص إعلانك "${ad.title}" على دلالة...`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: ad.title,
                    text: `شوف الإعلان ده في دلالة! ${ad.title} بسعر ${Number(ad.price).toLocaleString()} SDG`,
                    url: window.location.href,
                });
            } catch (error) {
                // Silently fail or handle error gracefully
            }
        } else {
            alert('تم نسخ الرابط للحافظة');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleReport = () => {
        alert('تم تقديم البلاغ للإدارة. شكراً لمساعدتك في الحفاظ على جودة المحتوى.');
    };

    const toggleFavorite = () => {
        if (!isLoggedIn) {
            onLoginClick();
            return;
        }
        setIsFavorite(!isFavorite);
        // TODO: Implement DB persistence
    };

    if (loading) return <div className="text-center py-20 text-gray-500">جاري التحميل...</div>;
    if (!ad) return <div className="text-center py-20 text-gray-500">الإعلان غير موجود</div>;

    const hasMultipleImages = ad.images && ad.images.length > 0;
    const imagesToDisplay = hasMultipleImages ? ad.images : ["https://placehold.co/600x400/f1f5f9/475569?text=Delala"];

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Header / Back Button */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowRight className="w-6 h-6 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-800">تفاصيل الإعلان</span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    #{ad.id.toString().slice(0, 8)}
                </div>
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

                {/* Image Counter */}
                {hasMultipleImages && ad.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm font-medium tracking-wider">
                        {currentImageIndex + 1} / {ad.images.length}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title & Price */}
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-[#009688] leading-snug flex-1 ml-4">{ad.title}</h1>
                </div>
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
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400">رقم الإعلان: {ad.id}</span>
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

                {/* Comments Section */}
                <div className="border-t border-gray-100 pt-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">الردود (0)</h3>

                    {/* Mock Comments List */}
                    <div className="space-y-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-3 h-3 text-gray-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-700">مستخدم</span>
                                <span className="text-[10px] text-gray-400">قبل ساعة</span>
                            </div>
                            <p className="text-sm text-gray-600">هل السعر قابل للتفاوض؟</p>
                        </div>
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="أضف ردك هنا..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#009688] transition-colors"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button className="bg-[#009688] text-white p-2 rounded-full hover:bg-teal-700 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Control Center Toolbar (Sticky Footer) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 safe-area-pb">
                {/* Message */}
                <button
                    onClick={handleWhatsAppClick}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#009688] transition-colors min-w-[60px]"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-[10px] font-medium">مراسلة</span>
                </button>

                {/* Favorite */}
                <button
                    onClick={toggleFavorite}
                    className={`flex flex-col items-center gap-1 transition-colors min-w-[60px] ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">تفضيل</span>
                </button>

                {/* Share */}
                <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors min-w-[60px]"
                >
                    <Share2 className="w-6 h-6" />
                    <span className="text-[10px] font-medium">مشاركة</span>
                </button>

                {/* Report */}
                <button
                    onClick={handleReport}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors min-w-[60px]"
                >
                    <Flag className="w-6 h-6" />
                    <span className="text-[10px] font-medium">بلاغ</span>
                </button>

                {/* Call Button (Prominent) */}
                <button
                    onClick={handleCallClick}
                    className="bg-[#115ea3] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors mr-2"
                >
                    <Phone className="w-4 h-4" />
                    <span>إتصال</span>
                </button>
            </div>
        </div>
    );
}
