import React from 'react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
            <div className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
                <h1 className="text-3xl font-bold mb-2 text-[#115ea3]">اتفاقية الاستخدام والشروط القانونية</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    مرحباً بك في دلالة. نرجو قراءة هذه الشروط بدقة. <span className="font-bold text-gray-900">بمجرد تصفحك للموقع، أو تسجيلك فيه، أو نشرك لأي إعلان، فإنك تقر بموافقتك الكاملة والنهائية على الالتزام بهذه الاتفاقية.</span> إذا كنت لا توافق على أي بند، يرجى التوقف عن استخدام الموقع فوراً.
                </p>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-8">

                    {/* Clause 1 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            طبيعة الخدمة
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            دلالة هي منصة وساطة تقنية فقط لربط البائع بالمشتري. نحن لا نملك السلع، لا نفحصها، ولا نضمنها.
                        </p>
                    </section>

                    {/* Clause 2 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            عمولة الموقع (1%)
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            يقر المعلن بأن خدمات دلالة ليست مجانية بالكامل. في حال إتمام البيع، يستحق الموقع عمولة <span className="font-bold text-red-600">1%</span> من قيمة السلعة، وهي أمانة في ذمة <span className="font-bold">البائع</span> تُدفع بعد إتمام البيع. سدادكم للعمولة يضمن استمرار المنصة في خدمتكم.
                        </p>
                    </section>

                    {/* Clause 3 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            السلع المحظورة
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            يمنع منعاً باتاً تداول: الأسلحة، العملات الأجنبية (السوق الأسود)، الأدوية، الوثائق الرسمية، والسلع المسروقة. أي إعلان مشبوه سيتم حذفه وإبلاغ السلطات إذا لزم الأمر.
                        </p>
                    </section>

                    {/* Clause 4 */}
                    <section className="bg-red-50 p-4 rounded-md border border-red-100">
                        <h2 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
                            <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            إخلاء المسؤولية (هام)
                        </h2>
                        <p className="text-red-700 leading-relaxed pr-10 font-medium">
                            المنصة غير مسؤولة عن أي تحويلات مالية تتم بين الأطراف. ننصح دائماً بتسليم السلعة والمال يداً بيد في مكان عام وآمن.
                        </p>
                    </section>

                    {/* Clause 5 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            التعويض (Indemnification)
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            يوافق المستخدم على تعويض إدارة دلالة عن أي خسائر أو مطالبات قانونية تنشأ بسبب إساءة استخدامه للمنصة أو انتهاكه لحقوق الآخرين.
                        </p>
                    </section>

                    {/* Clause 6 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                            حقوق الملكية
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            بنشرك للإعلان، أنت تمنح دلالة حقاً دائماً ومجانياً لاستخدام الصور والمحتوى لأغراض تطوير المنصة والتسويق.
                        </p>
                    </section>

                    {/* Clause 7 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                            الإنهاء
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            يحق لإدارة دلالة تجميد أو حذف أي حساب يخالف هذه الشروط دون سابق إنذار.
                        </p>
                    </section>

                    {/* Clause 8 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                            التعديلات
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            نحتفظ بحقنا في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات هنا، ويعتبر استمرارك في استخدام الموقع بعد التعديل بمثابة موافقة صريحة عليها.
                        </p>
                    </section>

                    {/* Clause 9 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="bg-[#115ea3] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                            القانون واجب التطبيق
                        </h2>
                        <p className="text-gray-700 leading-relaxed pr-10">
                            تخضع هذه الاتفاقية لقوانين جمهورية السودان، ويختص القضاء السوداني بالفصل في أي نزاع ينشأ عنها.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsPage;
