import React, { useState } from 'react';
import { User, Camera, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';
import imageCompression from 'browser-image-compression';

export default function ProfileSetupModal({ isOpen, userId, onComplete }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

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
                const fileName = `${userId}/${Math.random()}.${fileExt}`;
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
                    id: userId,
                    first_name: firstName.trim(),
                    last_name: lastName.trim() || null,
                    profile_picture_url: profilePictureUrl,
                    updated_at: new Date(),
                });

            if (updateError) throw updateError;

            onComplete();
        } catch (err) {
            console.error('Error setting up profile:', err);
            setError(err.message || 'حدث خطأ أثناء إعداد الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[#115ea3]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">
                        أكمل ملفك الشخصي
                    </h3>
                    <p className="text-gray-500 text-sm">
                        الاسم الأول مطلوب، باقي البيانات اختيارية
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-2 group">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#115ea3] text-white p-2 rounded-full cursor-pointer hover:bg-[#0d4b82] transition-colors shadow-md">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">صورة شخصية (اختياري)</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                الاسم الأول <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="مثال: محمد"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !firstName.trim()}
                        className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold hover:bg-[#0d4b82] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ ومتابعة'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
