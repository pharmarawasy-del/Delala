import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { LayoutDashboard, List, Inbox, Trash2, Loader2, Users, FileText, Mail } from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ users: 0, ads: 0, messages: 0 });
    const [ads, setAds] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: adsCount } = await supabase.from('ads').select('*', { count: 'exact', head: true });
                const { count: msgsCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
                setStats({ users: usersCount || 0, ads: adsCount || 0, messages: msgsCount || 0 });
            } else if (activeTab === 'ads') {
                const { data } = await supabase.from('ads').select('*, profiles(first_name, last_name)').order('created_at', { ascending: false });
                setAds(data || []);
            } else if (activeTab === 'inbox') {
                const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
                setMessages(data || []);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ad? This cannot be undone.')) return;

        try {
            const { error } = await supabase.from('ads').delete().eq('id', id);
            if (error) throw error;
            setAds(ads.filter(ad => ad.id !== id));
        } catch (error) {
            alert('Error deleting ad: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-[#115ea3] text-white hidden md:block flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">لوحة التحكم</h1>
                    <p className="text-blue-200 text-sm mt-1">God Mode</p>
                </div>
                <nav className="mt-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${activeTab === 'overview' ? 'bg-[#0d4b82]' : 'hover:bg-[#0d4b82]'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>نظرة عامة</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${activeTab === 'ads' ? 'bg-[#0d4b82]' : 'hover:bg-[#0d4b82]'}`}
                    >
                        <List className="w-5 h-5" />
                        <span>إدارة الإعلانات</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${activeTab === 'inbox' ? 'bg-[#0d4b82]' : 'hover:bg-[#0d4b82]'}`}
                    >
                        <Inbox className="w-5 h-5" />
                        <span>الرسائل</span>
                    </button>
                </nav>
            </aside>

            {/* Mobile Tabs (Top) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[#115ea3] text-white z-50 flex justify-around p-2">
                <button onClick={() => setActiveTab('overview')} className={`p-2 rounded ${activeTab === 'overview' ? 'bg-[#0d4b82]' : ''}`}><LayoutDashboard /></button>
                <button onClick={() => setActiveTab('ads')} className={`p-2 rounded ${activeTab === 'ads' ? 'bg-[#0d4b82]' : ''}`}><List /></button>
                <button onClick={() => setActiveTab('inbox')} className={`p-2 rounded ${activeTab === 'inbox' ? 'bg-[#0d4b82]' : ''}`}><Inbox /></button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 mt-12 md:mt-0 overflow-y-auto h-screen">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-8 h-8 text-[#115ea3] animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">المستخدمين</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-4 bg-green-50 rounded-full text-green-600">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">الإعلانات</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stats.ads}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-4 bg-purple-50 rounded-full text-purple-600">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">الرسائل</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stats.messages}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ads' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="bg-gray-50 text-gray-500 text-sm">
                                            <tr>
                                                <th className="p-4">الصورة</th>
                                                <th className="p-4">العنوان</th>
                                                <th className="p-4">السعر</th>
                                                <th className="p-4">المستخدم</th>
                                                <th className="p-4">التاريخ</th>
                                                <th className="p-4">إجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {ads.map(ad => (
                                                <tr key={ad.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <img
                                                            src={ad.images?.[0] || 'https://placehold.co/50x50'}
                                                            alt=""
                                                            className="w-12 h-12 rounded object-cover"
                                                        />
                                                    </td>
                                                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{ad.title}</td>
                                                    <td className="p-4 text-[#009688] font-bold">{ad.price.toLocaleString()}</td>
                                                    <td className="p-4 text-sm text-gray-500">
                                                        {ad.profiles?.first_name} {ad.profiles?.last_name}
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-400">
                                                        {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                                                    </td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() => handleDeleteAd(ad.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                            title="حذف الإعلان"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'inbox' && (
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{msg.name}</h4>
                                                <p className="text-sm text-gray-500">{msg.email} • {msg.phone}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(msg.created_at).toLocaleString('ar-EG')}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                                            {msg.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
