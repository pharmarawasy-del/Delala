import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { supabase } from '../supabase';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        subject: 'استفسار عام',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        name: formData.name,
                        contact_info: formData.contact, // Assuming column name is contact_info based on context, or 'contact'
                        subject: formData.subject,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            setIsSubmitted(true);
            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: '',
                    contact: '',
                    subject: 'استفسار عام',
                    message: ''
                });
            }, 3000);
        } catch (error) {
            console.error('Error submitting message:', error);
            alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
            <div className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
                <h1 className="text-3xl font-bold mb-4 text-[#115ea3] text-center">اتصل بنا</h1>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    هل واجهت مشكلة أو لديك اقتراح لتطوير المنصة؟<br />
                    نحن هنا للاستماع والمساعدة. املأ النموذج أدناه وسيصلك الرد قريباً.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md order-2 md:order-1">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">أرسل لنا رسالة</h2>

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                تم استلام رسالتك بنجاح. سنتواصل معك قريباً.
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">الاسم</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#115ea3]"
                                    placeholder="أدخل اسمك بالكامل"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني أو الهاتف</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#115ea3]"
                                    placeholder="كيف يمكننا التواصل معك؟"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">الموضوع</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#115ea3]"
                                >
                                    <option value="استفسار عام">استفسار عام</option>
                                    <option value="دعم فني">دعم فني</option>
                                    <option value="إبلاغ عن مخالفة">إبلاغ عن مخالفة</option>
                                    <option value="اقتراح">اقتراح</option>
                                    <option value="أخرى">أخرى</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">الرسالة</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#115ea3]"
                                    placeholder="اكتب رسالتك هنا..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#115ea3] hover:bg-[#0e4d85] text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                إرسال الرسالة
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-6 order-1 md:order-2">
                        <div className="bg-[#115ea3] text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">معلومات التواصل</h2>
                            <p className="mb-6 text-blue-100">
                                نحن هنا لمساعدتك. لا تتردد في التواصل معنا عبر أي من القنوات التالية.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-200">البريد الإلكتروني</div>
                                        <div className="font-bold dir-ltr text-right">support@delala.sd</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-200">واتساب / هاتف</div>
                                        <div className="font-bold dir-ltr text-right">+249 123 456 789</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-200">المقر الرئيسي</div>
                                        <div className="font-bold">الخرطوم، السودان</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-gray-800 mb-2">ساعات العمل</h3>
                            <p className="text-gray-600 text-sm">
                                فريق الدعم متواجد لخدمتكم يومياً من الساعة 9 صباحاً وحتى 10 مساءً بتوقيت السودان.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
