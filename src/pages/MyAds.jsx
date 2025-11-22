import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { Trash2, Edit, Loader2, AlertTriangle } from 'lucide-react';

export default function MyAds() {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/');
                return;
            }

            const { data, error } = await supabase
                .from('ads')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error('Error fetching my ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.')) {
            return;
        }

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('ads')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from local state
            setAds(ads.filter(ad => ad.id !== id));
        } catch (error) {
            console.error('Error deleting ad:', error);
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (id) => {
        // Placeholder for edit functionality
        alert('سيتم تفعيل تعديل الإعلانات قريباً');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#115ea3]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">إعلاناتي</h1>
                    <span className="bg-blue-100 text-[#115ea3] px-4 py-1 rounded-full font-bold text-sm">
                        {ads.length} إعلان
                    </span>
                </div>

                {ads.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد إعلانات</h3>
                        <p className="text-gray-500 mb-6">لم تقم بنشر أي إعلانات حتى الآن</p>
                        <button
                            onClick={() => navigate('/post-ad')}
                            className="bg-[#F59E0B] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d98c0a] transition-colors"
                        >
                            أضف إعلانك الأول
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ads.map((ad) => (
                            <div key={ad.id} className="relative group">
                                <ListingCard item={ad} />

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-4 left-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation from ListingCard
                                            handleEdit(ad.id);
                                        }}
                                        className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation from ListingCard
                                            handleDelete(ad.id);
                                        }}
                                        disabled={deletingId === ad.id}
                                        className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-colors disabled:opacity-50"
                                        title="حذف"
                                    >
                                        {deletingId === ad.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
