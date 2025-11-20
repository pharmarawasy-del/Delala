import React, { useState } from 'react';
import { Car, Smartphone, Armchair, Home, Upload, Check, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import imageCompression from 'browser-image-compression';

const CATEGORIES = [
    { id: 'vehicles', name: 'سيارات', icon: Car },
    { id: 'electronics', name: 'إلكترونيات', icon: Smartphone },
    { id: 'furniture', name: 'أثاث', icon: Armchair },
    { id: 'real-estate', name: 'عقارات', icon: Home },
];

export default function PostAdForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        price: '',
        location: 'Khartoum',
        description: '',
    });

    const handleCategorySelect = (categoryId) => {
        setFormData({ ...formData, category: categoryId });
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Limit to 10 images total
            const remainingSlots = 10 - imageFiles.length;
            const filesToAdd = files.slice(0, remainingSlots);

            if (filesToAdd.length > 0) {
                const newFiles = [...imageFiles, ...filesToAdd];
                setImageFiles(newFiles);

                const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
                setImagePreviews([...imagePreviews, ...newPreviews]);
            }
        }
    };

    const removeImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        setImageFiles(newFiles);

        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        // Revoke old URL to avoid memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePublish = async () => {
        setIsSubmitting(true);
        const uploadedUrls = [];

        // 1. Upload Images in Parallel with Compression
        if (imageFiles.length > 0) {
            try {
                const uploadPromises = imageFiles.map(async (file) => {
                    // Compress Image
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };

                    let fileToUpload = file;
                    try {
                        fileToUpload = await imageCompression(file, options);
                        console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
                    } catch (compressionError) {
                        console.warn("Image compression failed, using original file:", compressionError);
                    }

                    // Sanitize filename
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

                    const { error: uploadError } = await supabase.storage
                        .from('images')
                        .upload(fileName, fileToUpload);

                    if (uploadError) throw uploadError;

                    const { data: publicUrlData } = supabase.storage
                        .from('images')
                        .getPublicUrl(fileName);

                    return publicUrlData.publicUrl;
                });

                const results = await Promise.all(uploadPromises);
                uploadedUrls.push(...results);

            } catch (err) {
                console.error("Error during image upload:", err);
            }
        }

        // If no images uploaded, use placeholder
        if (uploadedUrls.length === 0) {
            uploadedUrls.push('https://placehold.co/600x400?text=No+Image');
        }

        // 2. Database Insert
        try {
            const payload = {
                title: formData.title,
                price: formData.price,
                city: formData.location,
                category: formData.category,
                phone: '0912345678', // Mock phone
                description: formData.description,
                images: uploadedUrls // Send array of strings
            };

            console.log("Sending payload to Supabase:", payload);

            const { error } = await supabase
                .from('ads')
                .insert([payload]);

            if (error) throw error;

            alert('تم نشر الإعلان بنجاح!');
            navigate('/');
        } catch (error) {
            console.error('FATAL: Database Insert Failed:', error);
            alert(`حدث خطأ أثناء النشر: ${error.message || 'خطأ غير معروف'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-100 -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-[#009688] text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div>
                    <h3 className="text-xl font-bold mb-6 text-center">اختر القسم</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-[#009688] hover:bg-teal-50 transition-all gap-3"
                            >
                                <cat.icon className="w-8 h-8 text-[#009688]" />
                                <span className="font-bold text-gray-700">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold mb-6 text-center">تفاصيل الإعلان</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#009688] outline-none"
                            placeholder="مثال: تويوتا هايلكس 2020"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">السعر (جنية سوداني)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#009688] outline-none"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#009688] outline-none"
                        >
                            <option value="الخرطوم">الخرطوم</option>
                            <option value="أم درمان">أم درمان</option>
                            <option value="بحري">بحري</option>
                            <option value="بورتسودان">بورتسودان</option>
                            <option value="عطبرة">عطبرة</option>
                            <option value="شندي">شندي</option>
                            <option value="دنقلا">دنقلا</option>
                            <option value="مدني">مدني</option>
                            <option value="القضارف">القضارف</option>
                            <option value="كسلا">كسلا</option>
                            <option value="الأبيض">الأبيض</option>
                            <option value="الفاشر">الفاشر</option>
                            <option value="نيالا">نيالا</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#009688] outline-none"
                            placeholder="اكتب وصفاً تفصيلياً..."
                        ></textarea>
                    </div>

                    {/* Multi-Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">صور الإعلان (يمكنك اختيار أكثر من صورة)</label>

                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {imagePreviews.length < 10 && (
                                <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#009688] transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-[#009688]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Plus className="w-6 h-6 mb-1" />
                                    <span className="text-xs">إضافة</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 text-left">{imagePreviews.length}/10 صور</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 py-3 rounded-xl font-bold border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            رجوع
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#009688] text-white py-3 rounded-xl font-bold hover:bg-teal-700"
                        >
                            التالي
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">مراجعة الإعلان</h3>
                    <p className="text-gray-500 mb-8">هل أنت متأكد من نشر هذا الإعلان؟</p>

                    <div className="bg-gray-50 rounded-xl p-4 text-right mb-8">
                        {imagePreviews.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                ))}
                            </div>
                        )}
                        <p className="font-bold text-lg mb-1">{formData.title}</p>
                        <p className="text-[#F59E0B] font-bold mb-2">{Number(formData.price).toLocaleString()} SDG</p>
                        <p className="text-gray-600 text-sm">{formData.location}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            className="flex-1 py-3 rounded-xl font-bold border border-gray-300 text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            تعديل
                        </button>
                        <button
                            onClick={handlePublish}
                            className="flex-1 bg-[#009688] text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري رفع الصور...' : 'نشر الآن'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
