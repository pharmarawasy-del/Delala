import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { User, Camera, LogOut, Save, Loader2, Mail } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                navigate('/');
                return;
            }

            setEmail(authUser.email);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (profile) {
                setUser(profile);
                setFirstName(profile.first_name || '');
                setLastName(profile.last_name || '');
                setAvatarPreview(profile.profile_picture_url);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('No user logged in');

            let profilePictureUrl = user?.profile_picture_url;

            if (avatarFile) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 500,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(avatarFile, options);

                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${authUser.id}/${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                profilePictureUrl = publicUrl;
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: authUser.id,
                    first_name: firstName,
                    last_name: lastName,
                    profile_picture_url: profilePictureUrl,
                    updated_at: new Date(),
                });

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });

            // Refresh user data in App (optional, but good practice if we had a context)
            // For now, just update local state
            setUser(prev => ({
                ...prev,
                first_name: firstName,
                last_name: lastName,
                profile_picture_url: profilePictureUrl
            }));

        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
        window.location.reload(); // Force reload to clear all states
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
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">الملف الشخصي</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header / Avatar Section */}
                    <div className="bg-[#115ea3] p-8 text-center relative">
                        <div className="relative inline-block group">
                            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg mx-auto mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-300" />
                                    )}
                                </div>
                            </div>
                            <label className="absolute bottom-4 right-0 bg-white text-[#115ea3] p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-50 transition-colors">
                                <Camera className="w-5 h-5" />
                                <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                            </label>
                        </div>
                        <h2 className="text-white text-xl font-bold">
                            {firstName} {lastName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-blue-100 mt-1 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{email}</span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        {message && (
                            <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave}>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الأول</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم العائلة</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold hover:bg-[#0d4b82] transition-colors shadow-md flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>حفظ التغييرات</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
