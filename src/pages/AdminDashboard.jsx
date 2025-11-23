import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ user }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Security Gate
        if (user?.email !== 'pharma.rawasy@gmail.com') {
            navigate('/');
            return;
        }
        fetchAds();
    }, [user, navigate]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ads')
                .select('*, profiles(first_name, last_name, email, phone_number)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        try {
            const { error } = await supabase.from('ads').delete().eq('id', id);
            if (error) throw error;

            setAds(ads.filter(ad => ad.id !== id));
            alert('تم حذف الإعلان بنجاح');
        } catch (error) {
            console.error('Error deleting ad:', error);
            alert('حدث خطأ أثناء الحذف: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#115ea3] animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة (Control Room)</h1>
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>منطقة محظورة</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th className="p-4 whitespace-nowrap">الصورة</th>
                                <th className="p-4 whitespace-nowrap">العنوان</th>
                                <th className="p-4 whitespace-nowrap">السعر</th>
                                <th className="p-4 whitespace-nowrap">المستخدم</th>
                                <th className="p-4 whitespace-nowrap">التاريخ</th>
                                <th className="p-4 whitespace-nowrap">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ads.map(ad => (
                                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <img
                                            src={ad.images?.[0] || 'https://placehold.co/50x50'}
                                            alt=""
                                            className="w-10 h-10 rounded object-cover border border-gray-200"
                                        />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate" title={ad.title}>
                                        {ad.title}
                                    </td>
                                    <td className="p-4 text-[#009688] font-bold whitespace-nowrap">
                                        {ad.price.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="font-bold">{ad.profiles?.first_name} {ad.profiles?.last_name}</div>
                                        <div className="text-xs text-gray-400">{ad.profiles?.email || 'No Email'}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                                        {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeleteAd(ad.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg transition-all shadow-sm"
                                            title="حذف الإعلان نهائياً"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {ads.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد إعلانات لعرضها
                    </div>
                )}
            </div>
        </div>
    );
}
