import React, { useState } from 'react';
import { User, Camera, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetupPage({ user, onComplete }) {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If no user, redirect to home (should be handled by App.jsx routing, but safety first)
    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!firstName.trim()) {
            setError('الاسم الأول مطلوب');
            return;
        }

        setLoading(true);

        try {
            let profilePictureUrl = null;

            if (avatarFile) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 500,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(avatarFile, options);

                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user.id}/${Math.random()}.${fileExt}`;
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
                    id: user.id,
                    first_name: firstName.trim(),
                    last_name: lastName.trim() || null,
                    profile_picture_url: profilePictureUrl,
                    updated_at: new Date(),
                });

            if (updateError) throw updateError;

            // Call parent handler to refresh user state
            if (onComplete) {
                await onComplete();
            }

            // Navigate to home
            navigate('/');
        } catch (err) {
            console.error('Error setting up profile:', err);
            setError(err.message || 'حدث خطأ أثناء إعداد الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-[#115ea3]" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">
                        أكمل ملفك الشخصي
                    </h1>
                    <p className="text-gray-500">
                        الاسم الأول مطلوب، باقي البيانات اختيارية
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-3 group">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-14 h-14" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#115ea3] text-white p-2.5 rounded-full cursor-pointer hover:bg-[#0d4b82] transition-colors shadow-md transform hover:scale-105">
                                <Camera className="w-5 h-5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">صورة شخصية (اختياري)</p>
                    </div>

                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                الاسم الأول <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="مثال: محمد"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                اسم العائلة <span className="text-gray-400 font-normal">(اختياري)</span>
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="مثال: أحمد"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !firstName.trim()}
                        className="w-full bg-[#115ea3] text-white py-4 rounded-xl font-bold hover:bg-[#0d4b82] transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                        {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ ومتابعة'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
